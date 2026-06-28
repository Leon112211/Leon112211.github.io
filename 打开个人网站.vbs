Option Explicit

Dim shell, fso, projectDir, siteUrl, command, i
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
siteUrl = "http://127.0.0.1:4173"

' Always start a FRESH dev server. Any process still listening on port 4173
' (e.g. a previous server stuck in a broken hot-reload state that serves a
' blank page) is killed first, so the launcher never reuses a stale instance.
KillPortListeners 4173
WScript.Sleep 500

command = "cmd /c cd /d """ & projectDir & """ && npm run dev -- --host 127.0.0.1 --port 4173"
shell.Run command, 0, False

For i = 1 To 30
  WScript.Sleep 500
  If IsSiteRunning(siteUrl) Then Exit For
Next

If IsSiteRunning(siteUrl) Then
  shell.Run siteUrl, 1, False
Else
  MsgBox "Unable to start the website. Please make sure Node.js and npm are installed.", 16, "Portfolio Launcher"
End If

Function IsSiteRunning(url)
  Dim request
  On Error Resume Next
  Set request = CreateObject("WinHttp.WinHttpRequest.5.1")
  request.SetTimeouts 400, 400, 400, 400
  request.Open "GET", url, False
  request.Send
  IsSiteRunning = (Err.Number = 0 And request.Status >= 200 And request.Status < 500)
  Err.Clear
  On Error GoTo 0
End Function

' Kill every process that is LISTENING on the given port. Uses PowerShell's
' Get-NetTCPConnection for precise port->PID resolution (no fragile netstat
' parsing). Errors are swallowed so a failed kill never blocks the launch.
Sub KillPortListeners(port)
  On Error Resume Next
  shell.Run "powershell -NoProfile -Command ""Get-NetTCPConnection -LocalPort " & port & " -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }""", 0, True
  On Error GoTo 0
End Sub
