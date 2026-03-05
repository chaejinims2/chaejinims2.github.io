@(
  '2026-03-05-memory-swap.md',
  '2026-03-05-pipe-and-pipeline.md',
  '2026-03-05-redirection-io-flow.md',
  '2026-03-05-virtual-console-tty.md',
  '2026-03-05-iaas-paas-saas-faas.md',
  '2026-03-05-serverless-faas-cost.md',
  '2026-03-05-memory-allocation.md',
  '2026-03-05-linux-licenses-overview.md',
  '2026-03-05-oss-license-risk-management.md'
) | ForEach-Object {
  New-Item -Path $_ -ItemType File -Force
}

# powershell -ExecutionPolicy Bypass -File .\update.ps1