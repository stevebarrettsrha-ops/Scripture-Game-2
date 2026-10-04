<#
  THE VOYAGE, played from this Windows computer.

  Serves the game's folder on this computer's own address (localhost, never the network),
  opens it in the default browser, and keeps serving until this window is closed (or,
  started from a desktop shortcut, until it has been idle a while). Nothing is fetched from
  the internet: three.js, the world, the Besorah and every recorded voice are in the folder.
  It needs nothing installed - Windows PowerShell comes with every Windows.

    powershell -ExecutionPolicy Bypass -File local\serve.ps1 [-Page voyage|story|unfolds]
                [-Port 8642] [-IdleMinutes 0] [-NoBrowser]

  The port is kept the same every time on purpose: a browser keeps a game's saves per
  address, so the same address means the same saves. A running instance is reused.
#>
param(
  [ValidateSet('voyage','story','unfolds')][string]$Page = 'voyage',
  [int]$Port = 8642,
  [double]$IdleMinutes = 0,
  [switch]$NoBrowser
)
$ErrorActionPreference = 'Stop'
$Root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$Sep = [IO.Path]::DirectorySeparatorChar
$Root = $Root.TrimEnd($Sep)
$RootSep = $Root + $Sep
$Sig = 'scripture-game-local'
$Pages = @{ voyage = 'index.html'; story = 'story/index.html'; unfolds = 'scripture-unfolds/index.html' }
$Types = @{
  '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'
  '.json'='application/json'; '.webm'='audio/webm'; '.ogg'='audio/ogg'; '.mp3'='audio/mpeg'; '.wav'='audio/wav'
  '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'
  '.woff2'='font/woff2'; '.txt'='text/plain; charset=utf-8'; '.md'='text/plain; charset=utf-8'
}
# THE SAVES FOLDER (local\saves.js): progress kept in files in saves\ beside the game, the edited
# pieces of the world in saves\world\. Only names of this shape are ever read or written.
$Saves = Join-Path $Root 'saves'
$SaveName = '^(world/)?[A-Za-z0-9._~-]{1,160}\.json$'
$Utf8 = New-Object System.Text.UTF8Encoding($false)
try { $Host.UI.RawUI.WindowTitle = 'THE VOYAGE - local server (close to stop)' } catch {}

function Test-Ours([int]$p) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:$p/__scripture_game" -TimeoutSec 2
    return ([string]$r.Content) -eq $Sig
  } catch { return $false }
}

$listener = $null
for ($p = $Port; $p -lt $Port + 20; $p++) {
  if (Test-Ours $p) {
    $url = "http://localhost:$p/" + $Pages[$Page]
    Write-Host "THE VOYAGE is already running at $url"
    if (-not $NoBrowser) { Start-Process $url }
    exit 0
  }
  $l = New-Object System.Net.HttpListener
  $l.Prefixes.Add("http://localhost:$p/")
  try { $l.Start(); $listener = $l; $Port2 = $p; break } catch { try { $l.Close() } catch {} }
}
if (-not $listener) { Write-Host "No free port between $Port and $($Port + 19)."; exit 1 }

$url = "http://localhost:$Port2/" + $Pages[$Page]
if ($Port2 -ne $Port) { Write-Host "Note: port $Port was busy, so $Port2 is used. Saves made on one port are not seen on the other." }
Write-Host ''
Write-Host '  THE VOYAGE is running on this computer at'
Write-Host "  $url"
Write-Host ''
Write-Host '  Leave this window open while you play. Close it (or press Ctrl+C) to stop.'
Write-Host ''
if (-not $NoBrowser) { Start-Process $url }

function Send-Text($res, [int]$code, [string]$text) {
  $b = [Text.Encoding]::UTF8.GetBytes($text)
  $res.StatusCode = $code; $res.ContentType = 'text/plain; charset=utf-8'; $res.ContentLength64 = $b.Length
  $res.OutputStream.Write($b, 0, $b.Length)
}

$last = Get-Date
try {
  while ($listener.IsListening) {
    $task = $listener.GetContextAsync()
    # waited on in short steps, so Ctrl+C and the idle stop are heard
    while (-not $task.AsyncWaitHandle.WaitOne(500)) {
      if ($IdleMinutes -gt 0 -and ((Get-Date) - $last).TotalMinutes -gt $IdleMinutes) { $listener.Stop(); exit 0 }
    }
    $ctx = $task.GetAwaiter().GetResult()
    $last = Get-Date
    $req = $ctx.Request; $res = $ctx.Response
    try {
      $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
      if ($path -eq '/__scripture_game') { Send-Text $res 200 $Sig; continue }
      if ($path -eq '/__saves') {
        $files = @{}
        foreach ($sub in @('', 'world/')) {
          $d = Join-Path $Saves $sub
          if (-not (Test-Path -LiteralPath $d -PathType Container)) { continue }
          foreach ($f in [IO.Directory]::GetFiles($d)) {
            $n = $sub + [IO.Path]::GetFileName($f)
            if ($n -cmatch $SaveName) { try { $files[$n] = [IO.File]::ReadAllText($f, $Utf8) } catch {} }
          }
        }
        $b = $Utf8.GetBytes((@{ files = $files } | ConvertTo-Json -Compress -Depth 3))
        $res.StatusCode = 200; $res.ContentType = 'application/json'; $res.AddHeader('Cache-Control', 'no-cache')
        $res.ContentLength64 = $b.Length; $res.OutputStream.Write($b, 0, $b.Length); continue
      }
      if ($path.StartsWith('/__saves/')) {
        $n = $path.Substring(9)
        if ($n -cnotmatch $SaveName) { Send-Text $res 403 'Forbidden'; continue }
        $f = Join-Path $Saves ($n.Replace('/', $Sep))
        if ($req.HttpMethod -eq 'DELETE') { if (Test-Path -LiteralPath $f) { Remove-Item -LiteralPath $f -Force }; Send-Text $res 200 'removed'; continue }
        if ($req.HttpMethod -ne 'PUT') { Send-Text $res 405 'Method not allowed'; continue }
        $ms = New-Object IO.MemoryStream
        $req.InputStream.CopyTo($ms)
        [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($f))
        $tmp = $f + '.tmp'
        [IO.File]::WriteAllBytes($tmp, $ms.ToArray())        # written whole, then put in place
        try { if ([IO.File]::Exists($f)) { [IO.File]::Replace($tmp, $f, $null) } else { [IO.File]::Move($tmp, $f) } }
        catch { [IO.File]::Copy($tmp, $f, $true) }                 # the file came or went meanwhile: written over
        finally { if ([IO.File]::Exists($tmp)) { [IO.File]::Delete($tmp) } }
        Send-Text $res 200 'saved'; continue
      }
      $rel = $path.TrimStart('/').Replace('/', $Sep)
      $full = [IO.Path]::GetFullPath((Join-Path $Root $rel))
      if ($full -ne $Root -and -not $full.StartsWith($RootSep, [StringComparison]::OrdinalIgnoreCase)) { Send-Text $res 403 'Forbidden'; continue }
      if (Test-Path -LiteralPath $full -PathType Container) { $full = Join-Path $full 'index.html' }
      if (-not (Test-Path -LiteralPath $full -PathType Leaf)) { Send-Text $res 404 'Not found'; continue }
      $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
      $res.ContentType = $(if ($Types.ContainsKey($ext)) { $Types[$ext] } else { 'application/octet-stream' })
      $res.AddHeader('Cache-Control', 'no-cache')
      $fs = [IO.File]::OpenRead($full)
      try {
        $res.ContentLength64 = $fs.Length
        if ($req.HttpMethod -ne 'HEAD') { $fs.CopyTo($res.OutputStream) }
      } finally { $fs.Dispose() }
    } catch {
      # the browser let go of a request it no longer wanted: nothing to do
    } finally {
      try { $res.Close() } catch {}
    }
  }
} finally {
  try { $listener.Stop(); $listener.Close() } catch {}
}
