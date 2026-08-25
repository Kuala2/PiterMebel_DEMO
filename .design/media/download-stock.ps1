$ErrorActionPreference = 'Stop'
$target = Join-Path $PSScriptRoot 'images'
New-Item -ItemType Directory -Force -Path $target | Out-Null
$items = @(
  @{ Id='htmZWzApbJE'; File='01-kitchen-cabinetry.jpg' },
  @{ Id='IDAsplMgG7A'; File='02-living-shelving.jpg' },
  @{ Id='-QCjahEjubY'; File='03-integrated-bookshelf.jpg' },
  @{ Id='pgquDG8pEbg'; File='04-wardrobe.jpg' },
  @{ Id='iXkyevQaKws'; File='05-craft-lathe.jpg' },
  @{ Id='b5vBGnCsq_g'; File='06-workshop-tools.jpg' },
  @{ Id='SwzkiXrwrtI'; File='07-table-detail.jpg' },
  @{ Id='JD_uV-Iddn4'; File='08-wood-grain.jpg' }
)
foreach ($item in $items) {
  $uri = "https://unsplash.com/photos/$($item.Id)/download?force=true&w=2400"
  $out = Join-Path $target $item.File
  Invoke-WebRequest -Uri $uri -MaximumRedirection 10 -Headers @{ 'User-Agent'='Mozilla/5.0' } -OutFile $out
  Write-Output "[OK] $($item.File)"
}
