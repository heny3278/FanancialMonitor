const transactionStyles = `
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, system-ui, Arial, sans-serif;
  background: #f4f6f8;
  color: #17202a;
}
button, input, select { font: inherit; }
.app { min-height: 100vh; }
header {
  padding: 24px 5%;
  background: #111827;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}
header h1 { margin: 0 0 4px; font-size: 24px; }
header p { margin: 0; opacity: .7; }
nav { display: flex; gap: 8px; }
nav a {
  color: white; text-decoration: none; padding: 10px 14px; border-radius: 8px;
}
nav a.active { background: #374151; }
main { max-width: 1400px; margin: 32px auto; padding: 0 20px; }
.card {
  background: white; border-radius: 14px; padding: 24px;
  box-shadow: 0 4px 18px rgba(0,0,0,.06);
}
.muted { color: #667085; }
.form-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 18px; margin: 24px 0;
}
label { display: flex; flex-direction: column; gap: 7px; font-weight: 600; }
input, select {
  border: 1px solid #d0d5dd; border-radius: 8px; padding: 11px 12px;
  background: white;
}
.actions, .toolbar, .monitor-header {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
}
.actions { justify-content: flex-start; }
button {
  border: 0; border-radius: 8px; padding: 11px 16px; cursor: pointer;
  background: #e5e7eb;
}
button.primary { background: #2563eb; color: white; }
.message { margin-top: 16px; padding: 12px; background: #eef2ff; border-radius: 8px; }
.connection { font-weight: 700; }
.connection span {
  display: inline-block; width: 9px; height: 9px; border-radius: 50%;
  margin-right: 6px;
}
.connection.online { color: #15803d; }
.connection.online span { background: #22c55e; }
.connection.offline { color: #b91c1c; }
.connection.offline span { background: #ef4444; }
.toolbar { margin: 22px 0; padding: 12px 0; border-bottom: 1px solid #eee; }
.checkbox { flex-direction: row; align-items: center; font-weight: 500; }
.table-wrapper { overflow: auto; max-height: 650px; }
table { width: 100%; border-collapse: collapse; min-width: 800px; }
th, td { text-align: left; padding: 13px 10px; border-bottom: 1px solid #eee; }
th { position: sticky; top: 0; background: white; }
.mono { font-family: ui-monospace, monospace; font-size: 12px; }
.status { padding: 5px 9px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.status-completed { background: #dcfce7; color: #166534; }
.status-failed { background: #fee2e2; color: #991b1b; }
.status-pending { background: #fef3c7; color: #92400e; }
.empty { padding: 60px; text-align: center; color: #667085; }
@media (max-width: 700px) {
  header { flex-direction: column; align-items: flex-start; }
  .form-grid { grid-template-columns: 1fr; }
  .monitor-header { align-items: flex-start; flex-direction: column; }
}
`;

export default transactionStyles;
