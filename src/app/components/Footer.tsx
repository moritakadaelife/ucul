export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="elads-footer">
      Copyright &copy; 2002 - {currentYear} eLife Inc.
    </footer>
  );
}
