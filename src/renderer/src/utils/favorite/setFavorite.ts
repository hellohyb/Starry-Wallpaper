import { ref } from "vue";
import { useMessageStore } from '@renderer/stores/messageStore'
import pinia from "@renderer/stores/pinia";
const messageStore = useMessageStore(pinia);
const electronStore = window.electronStore
let favoriteAll = ref(electronStore.get('favorite')) || {}
const deepClone = (value) =>{
    return JSON.parse(JSON.stringify(value))
}
// 新增分类
export function addCategory(categoryName){
    favoriteAll.value = electronStore.get('favorite')
    let isNoSameName = true;
    for(let i = 0; i < favoriteAll.value.length; i++){
        if(favoriteAll.value[i].categoryName === categoryName){
            isNoSameName = false
        }
    }
    if(isNoSameName){
        favoriteAll.value.push({categoryName:categoryName,imgList:[]})
        electronStore.set('favorite',deepClone(favoriteAll.value))
        return true
    }else{
        return false
    }
}
// 删除分类
export function delCategory(categoryName){
    favoriteAll.value = electronStore.get('favorite')
    favoriteAll.value = favoriteAll.value.filter((item) => {
       return item.categoryName !== categoryName
    })
    electronStore.set('favorite',deepClone(favoriteAll.value))
    return true
}
// 新增收藏
export function addFavorite(imgInfo,categoryName = '默认收藏'){
    favoriteAll.value = electronStore.get('favorite')
    for(let i = 0; i < favoriteAll.value.length; i++){
        if(favoriteAll.value[i].categoryName == categoryName){
            favoriteAll.value[i].imgList.push(imgInfo)
        }
    }
    electronStore.set('favorite',deepClone(favoriteAll.value))
    return true
}
// 从本地导入时，格式化文件内容并保存至对应的收藏夹
export function insertLocalImageToFavorite(imageUrl,categoryName){
    // '/Users/huang/Downloads/pow-pow-jinx-desktop-7w8wu4y734gpkwoy.jpg'
    let imageInfo = {
        url:'file://'+imageUrl,
        tag:'本地图片：'+ imageUrl.slice(imageUrl.lastIndexOf('/') + 1,imageUrl.length),
        id:Date.now()+Math.random()*(10000-99999)+99999,
        local:true
    }
    addFavorite(imageInfo,categoryName)
}
// 取消收藏
export function delFavorite(imgInfo,showMessage = true){
    favoriteAll.value = electronStore.get('favorite')
    for(let i = 0; i < favoriteAll.value.length; i++){
            favoriteAll.value[i].imgList = favoriteAll.value[i].imgList.filter((item) => {
                return item.id !== imgInfo.id
        })
    }
    electronStore.set('favorite',deepClone(favoriteAll.value))
    favoriteAll.value = electronStore.get('favorite')
    // 通知收藏夹刷新
    messageStore.updateDelState(true)
    if(showMessage){
        ElMessage({message:"已取消收藏",type:"success"})
    }
    return true
}
// 清空收藏夹内容
export function cleanFavorite(categoryName){
    favoriteAll.value = electronStore.get('favorite')
    for(let i = 0; i < favoriteAll.value.length; i++){
        if(favoriteAll.value[i].categoryName == categoryName){
            favoriteAll.value[i].imgList = []
            electronStore.set('favorite',deepClone(favoriteAll.value))
            return true
        }
    }
    return false
}
// 判断是否已经收藏
export function isFavorited(imgInfo){
    for(let i = 0; i < favoriteAll.value.length; i++){
        for(let j = 0; j < favoriteAll.value[i].imgList.length; j++){
            if(favoriteAll.value[i].imgList[j].id == imgInfo.id){
                return true
            }
        }
    }
    return false
}