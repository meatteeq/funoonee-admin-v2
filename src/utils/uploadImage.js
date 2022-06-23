/** @format */

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import fireBaseApp from "../../Firebase";
const uploadToServer = async (image) => {
  console.log("image", image);

  const storage = getStorage(fireBaseApp);

  const storageRef = ref(storage, "img/" + image?.name + new Date().getHours());

  // getDownloadURL

  uploadBytes(storageRef, image)
    .then((snapshot) => {
      // console.log("Uploaded a blob or file!", snapshot.ref.fullPath);
      // console.log(snapshot.ref.fullPath);
    })
    .catch((err) => {});

  const result = await getDownloadURL(storageRef);

  return result;

  // storageRef.put(image)
};

export default uploadToServer;
