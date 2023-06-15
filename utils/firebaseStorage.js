const admin = require('firebase-admin');
const serviceAccount = require("../configuration/serviceAccount.json");
const firebaseConfig = {
    apiKey: "AIzaSyA_mN-c0fzLS08rlNHhYH0cukbj1R6cxss",
    authDomain: "platform-agritech.firebaseapp.com",
    projectId: "platform-agritech",
    storageBucket: "platform-agritech.appspot.com",
    messagingSenderId: "858614574125",
    appId: "1:858614574125:web:a023d082b1fb6daa60dca4",
    credential: admin.credential.cert(serviceAccount)
};
admin.initializeApp(firebaseConfig);
const storage = admin.storage().bucket()

const writeToCloudStorage = async (file, filename) => {
    return new Promise(resolve => {
        const writeStreamObject = storage.file("campaign_feature_imgs/" + filename).createWriteStream().end(file.buffer)
        writeStreamObject.on('finish', () => {
            resolve(`https://firebasestorage.googleapis.com/v0/b/platform-agritech.appspot.com/o/${encodeURIComponent("campaign_feature_imgs/" + filename)}?alt=media`)
        })
    })
}

const uploadImageToCloud = async (file, campaign, userId) => {
    try {
        const timestamp = Date.now();
        const type = file.originalname.split(".")[1];
        const fileName = `${userId}_${campaign}_${timestamp}.${type}`;
        const featuredImageUrl = await writeToCloudStorage(file, fileName)
        return featuredImageUrl
    } catch (error) {
        console.log(error)
        throw new Error('Image upload failed.')
    }
}

module.exports = uploadImageToCloud;
