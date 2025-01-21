!macro customInstall
  # Custom installation logic (optional)
!macroend

!macro customUnInstall
  # Notify the app to quit during uninstall
  ExecWait '"$INSTDIR\\TiriVD.exe" --quit'
!macroend
