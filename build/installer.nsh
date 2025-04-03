!macro customInit
  FileOpen $0 "$APPDATA\tiri-desktop\installflag" w
  FileClose $0

  IfFileExists "$INSTDIR\TiriVD.exe" 0 +2
  ExecWait '"$INSTDIR\TiriVD.exe" --quit'
!macroend

!macro customInstall
  Delete "$APPDATA\tiri-desktop\installflag"
!macroend

!macro customUnInstall
  # Notify the app to quit during uninstall
  ExecWait '"$INSTDIR\TiriVD.exe" --quit'

  # Remove app data upon uninstall, keep data upon update
  IfFileExists "$APPDATA\tiri-desktop\installflag" +2 0
  RMDir /r "$APPDATA\tiri-desktop\"
!macroend
