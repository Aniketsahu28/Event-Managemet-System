const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const useHandleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;  //if file is not choosen

    const data = new FormData();
    data.append("file", file)
    data.append("upload_preset", "agnelevents")
    data.append("cloud_name", "dhbkew2an")

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data
    })

    const uploadedImageUrl = await response.json();
    return uploadedImageUrl.url;
}
