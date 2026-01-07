import { Browser, BrowserContext, Page } from 'puppeteer';

// Mock puppeteer module
const mockPage = {
  setContent: jest.fn(),
  evaluate: jest.fn(),
  pdf: jest.fn(),
  close: jest.fn(),
} as unknown as jest.Mocked<Page>;

const mockContext = {
  newPage: jest.fn(),
  close: jest.fn(),
} as unknown as jest.Mocked<BrowserContext>;

const mockBrowser = {
  createBrowserContext: jest.fn(),
  close: jest.fn(),
} as unknown as jest.Mocked<Browser>;

const mockPuppeteerLaunch = jest.fn();

jest.mock('puppeteer', () => ({
  launch: mockPuppeteerLaunch,
}));

describe('pdf-service', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    jest.resetModules();
    
    // Setup default mock implementations
    mockBrowser.createBrowserContext = jest.fn().mockResolvedValue(mockContext);
    mockContext.newPage = jest.fn().mockResolvedValue(mockPage);
    mockPage.setContent = jest.fn().mockResolvedValue(undefined);
    mockPage.evaluate = jest.fn().mockResolvedValue(undefined);
    mockPage.pdf = jest.fn().mockResolvedValue(Buffer.from('mock-pdf-data'));
    mockPage.close = jest.fn().mockResolvedValue(undefined);
    mockContext.close = jest.fn().mockResolvedValue(undefined);
    mockBrowser.close = jest.fn().mockResolvedValue(undefined);
    
    mockPuppeteerLaunch.mockResolvedValue(mockBrowser);
  });

  describe('renderHtmlToPdfBuffer', () => {
    it('should generate PDF from HTML with default options', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><h1>Test</h1></body></html>';

      const result = await renderHtmlToPdfBuffer(html);

      expect(mockBrowser.createBrowserContext).toHaveBeenCalled();
      expect(mockContext.newPage).toHaveBeenCalled();
      expect(mockPage.setContent).toHaveBeenCalledWith(html, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      expect(mockPage.pdf).toHaveBeenCalledWith({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: expect.stringContaining('OFFICIAL-SENSITIVE'),
        footerTemplate: expect.stringContaining('OFFICIAL-SENSITIVE'),
        margin: {
          top: '20mm',
          bottom: '48px',
          left: '20mm',
          right: '20mm',
        },
      });
      expect(result).toBeInstanceOf(Buffer);
      expect(mockPage.close).toHaveBeenCalled();
      expect(mockContext.close).toHaveBeenCalled();
    });

    it('should generate PDF with custom header and footer templates', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><h1>Test</h1></body></html>';
      const customHeader = '<div>Custom Header</div>';
      const customFooter = '<div>Custom Footer</div>';

      await renderHtmlToPdfBuffer(html, {
        headerTemplate: customHeader,
        footerTemplate: customFooter,
      });

      expect(mockPage.pdf).toHaveBeenCalledWith(
        expect.objectContaining({
          headerTemplate: customHeader,
          footerTemplate: customFooter,
        }),
      );
    });

    it('should expand details elements before generating PDF', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><details><summary>Click</summary>Content</details></html>';

      await renderHtmlToPdfBuffer(html);

      expect(mockPage.evaluate).toHaveBeenCalled();
      expect(mockPage.setContent).toHaveBeenCalled();
      expect(mockPage.pdf).toHaveBeenCalled();
    });

    it('should close page and context even if PDF generation fails', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><h1>Test</h1></body></html>';
      const error = new Error('PDF generation failed');
      mockPage.pdf = jest.fn().mockRejectedValue(error);

      await expect(renderHtmlToPdfBuffer(html)).rejects.toThrow('PDF generation failed');

      expect(mockPage.close).toHaveBeenCalled();
      expect(mockContext.close).toHaveBeenCalled();
    });

    it('should not throw if page.close() fails during cleanup', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><h1>Test</h1></body></html>';
      mockPage.close = jest.fn().mockRejectedValue(new Error('Close failed'));

      const result = await renderHtmlToPdfBuffer(html);

      expect(result).toBeInstanceOf(Buffer);
      expect(mockPage.close).toHaveBeenCalled();
      expect(mockContext.close).toHaveBeenCalled();
    });

    it('should not throw if context.close() fails during cleanup', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><h1>Test</h1></body></html>';
      mockContext.close = jest.fn().mockRejectedValue(new Error('Context close failed'));

      const result = await renderHtmlToPdfBuffer(html);

      expect(result).toBeInstanceOf(Buffer);
      expect(mockPage.close).toHaveBeenCalled();
      expect(mockContext.close).toHaveBeenCalled();
    });

    it('should handle timeout during setContent', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><h1>Test</h1></body></html>';
      const timeoutError = new Error('Timeout exceeded');
      mockPage.setContent = jest.fn().mockRejectedValue(timeoutError);

      await expect(renderHtmlToPdfBuffer(html)).rejects.toThrow('Timeout exceeded');

      expect(mockPage.close).toHaveBeenCalled();
      expect(mockContext.close).toHaveBeenCalled();
    });

    it('should return Buffer from Uint8Array returned by page.pdf()', async () => {
      const { renderHtmlToPdfBuffer } = await import('../../../main/service/pdf-service');
      const html = '<html><body><h1>Test</h1></body></html>';
      const mockPdfData = new Uint8Array([1, 2, 3, 4, 5]);
      mockPage.pdf = jest.fn().mockResolvedValue(mockPdfData);

      const result = await renderHtmlToPdfBuffer(html);

      expect(result).toBeInstanceOf(Buffer);
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(Array.from(result)).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
