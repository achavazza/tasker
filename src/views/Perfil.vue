<template lang="">
    <h1>Perfil de usuario</h1>
    <div class="text-center mb-2">
        <a-avatar v-if="userStore.userData.photoURL" :src="userStore.userData.photoURL" :size="150"></a-avatar>
    </div>
    <a-row>
        
        <a-col :sm="{span:12, offset:6}">
            <a-form 
            name="basicPerfil"
            autocomplete="off"
            layout="vertical"
            :model="userStore.userData"
            @finish="onFinish"
            >
                <a-form-item
                    name="email"
                    label="Correo electrónico"
                    :rules="[{required:true, type:'email', whitespace:true, message: 'Ingresa un email'}]"
                >
                    <a-input v-model:value="userStore.userData.email" disabled></a-input>
                </a-form-item>
                <a-form-item
                    name="displayName"
                    label="Nombre de usuario"
                    :rules="[{required:true, whitespace:true, message: 'Ingresa un nick válido'}]"
                >
                    <a-input v-model:value="userStore.userData.displayName"></a-input>
                </a-form-item>
                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    :max-count="1"
                    @change="handleChange"
                    accept="image/png, image/jpeg"
                >
                    <a-button>Subir foto perfil</a-button>
                </a-upload>
                <a-form-item name="submit" class="mt-2">
                    <a-button 
                        type="primary" 
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                    >
                        Actualizar información
                    </a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>
<script setup>
import { ref } from 'vue';
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import { message } from 'ant-design-vue';
const fileList = ref([]);
const beforeUpload = (file) =>{
    fileList.value = [...fileList, file];
    return false;
};
/* ya anda para subir 1 imagen */
const handleChange = (info) => {
    if(info.file.status !== 'uploading'){
        //console.log(info.file);
        const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
        if(!isJpgOrPng){
            message.error('Sólo se admiten imágenes .jpeg o .png');
            handleRemove(info.file);
            return;
        }
        const istLt2M = info.file.size / 1024 / 1024 < 2;
        if(!istLt2M){
            message.error('Sólo se admiten imágenes de 2Mb como máximo');
            handleRemove(info.file);
            return;
        }
        //console.log(file, fileList);
    }
  
}
const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};


const onFinish = async() => {
    const error = await userStore.updateUser(
        userStore.userData.displayName, //displayName
        fileList.value[0] //imagen
    );

    if(!error){
        return message.success('Se actualizó tu información')
    }else{
        return message.error('Ocurrió un error')
    }
}
</script>
<style>
.text-center{text-align: center;}
.mb-2{margin-bottom: 2rem}
.mt-2{margin-top: 2rem}
</style>