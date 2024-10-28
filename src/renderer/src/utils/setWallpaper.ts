const ipcRenderer = window.electron.ipcRenderer
// macOS
const setMac = (filePath) => {
    const changeWallPaperCommand = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${filePath}"'`
    exec(changeWallPaperCommand, (error, _stdout, _stderr) => {
      if (error) {
        return false;
      }else{
        return true
      }
    });
}
// Windows
const setWindows = async (filePath) => {
  // 路径反斜杠替换
  let winfilepath:any = []
  for(let i = 0; i < filePath.length; i++){
    winfilepath[i] = filePath[i]
  }
  winfilepath[filePath.lastIndexOf('/')] = '\\'
  winfilepath = winfilepath.join('')
  // 调用带参数的函数
  return await ipcRenderer.invoke('setwindows',{winfilepath});
}
const {exec} = require('child_process')
// 设置壁纸
export default function setWallpaper(filePath){
    if(process.platform == 'darwin'){
        return setMac(filePath)
    }
    else if(process.platform == 'win32'){
        return setWindows(filePath)
    }
}
