declare module 'ssl-config' {
  type TLSProfile = 'modern' | 'intermediate' | 'old';

  interface SSLConfig {
    ciphers: string;
    minimumTLSVersion: number;
  }

  function createSslConfig(profile: TLSProfile): SSLConfig;

  export = createSslConfig;
}
