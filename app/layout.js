export const metadata = {
  title: 'CS AI Widget',
  description: 'Customer Service AI Widget'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}