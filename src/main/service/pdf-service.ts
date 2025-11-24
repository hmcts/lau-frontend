import puppeteer, { Browser, BrowserContext, Page, PDFOptions } from 'puppeteer';
import logger from '../modules/logging';

type PdfServiceOptions = {
  headerTemplate?: string;
  footerTemplate?: string;
};

const PDF_TIMEOUT = 60000; 
const DEFAULT_HEADER = '<div style="font-family: Arial, Helvetica, sans-serif; font-size:14px; width:100%; text-align:center; margin-top: 6px;">OFFICIAL-SENSITIVE</div>';
const DEFAULT_FOOTER = '<div style="font-family: Arial, Helvetica, sans-serif; font-size:10px; width:100%; text-align:center; margin-bottom:6px;">OFFICIAL-SENSITIVE — Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>';

/**
 * Singleton promise for a Puppeteer Browser instance.
 * Use Promise<Browser> so multiple callers don't trigger multiple launches.
 */
let browserPromise: Promise<Browser> | null = null;

/** Launch and return a singleton Puppeteer Browser (lazy). */
export async function getBrowser(): Promise<Browser> {
  if (browserPromise === null) {
    const launchOptions = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      headless: true,
      // Use system Chrome if PUPPETEER_EXECUTABLE_PATH is set (in Docker)
      ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      }),
    };
    
    browserPromise = puppeteer.launch(launchOptions);

    // Graceful close on process exit / termination signals
    const closeBrowser = async () => {
      try {
        const b = await browserPromise;
        await b?.close();
      } catch (err) {
        logger.warn('Error closing browser on shutdown', err as Error);
      }
    };

    const boundClose = () => {
      closeBrowser().catch((err) => {
        logger.warn('Error in browser shutdown handler', err as Error);
      });
    };

    process.once('exit', boundClose);
    process.once('SIGINT', boundClose);
    process.once('SIGTERM', boundClose);
  }

  return browserPromise;
}

/**
 * Expand all <details> elements so collapsible content is visible in PDF
 */
async function expandDetailsElements(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.querySelectorAll('details').forEach((details: HTMLDetailsElement) => {
      details.open = true;
    });
  });
}

/**
 * Render HTML to a PDF Buffer using Puppeteer.
 * - Inlines header/footer templates if provided.
 * - Uses an incognito context to reduce cross-request leakage.
 */
export async function renderHtmlToPdfBuffer(
  html: string,
  options: PdfServiceOptions = {},
): Promise<Buffer> {
  const browser = await getBrowser();
  const context: BrowserContext = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: PDF_TIMEOUT,
    });

    await expandDetailsElements(page);

    const pdfOptions: PDFOptions = {
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: options.headerTemplate ?? DEFAULT_HEADER,
      footerTemplate: options.footerTemplate ?? DEFAULT_FOOTER,
      margin: {
        top: '20mm',
        bottom: '48px',
        left: '20mm',
        right: '20mm',
      },
    };

    const pdfUint8Array = await page.pdf(pdfOptions);
    return Buffer.from(pdfUint8Array);
  } finally {
    await page.close().catch((err) => {
      logger.warn('Error closing PDF page', err as Error);
    });
    await context.close().catch((err) => {
      logger.warn('Error closing browser context', err as Error);
    });
  }
}