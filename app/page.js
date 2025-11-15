import Script from 'next/script';

export default function Home() {
  return (
    <>
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}> Test CS AI Widget
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9 }}>
            Klik buletan chat pojok kanan bawah!
          </p>
        </div>
      </div>

      <Script 
        src="/popup.js" 
        strategy="afterInteractive"
        data-api-key="whalecore_2024"
      />
    </>
  );
}
