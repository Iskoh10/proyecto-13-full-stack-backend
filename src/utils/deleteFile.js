const cloudinary = require('cloudinary').v2;

const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.log('No hay Url para eliminar');
      return;
    }

    const fileSplited = fileUrl.split('/');
    const folderName = fileSplited.at(-2);
    const fieldName = fileSplited.at(-1).split('.');
    const fieldNamePdf = fileSplited.at(-1);

    const extension = fieldName[1];
    const resourceType = extension === 'pdf' ? 'raw' : 'image';

    let public_id = '';

    if (resourceType === 'raw') {
      public_id = `${folderName}/${fieldNamePdf}`;
    } else {
      public_id = `${folderName}/${fieldName[0]}`;
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resourceType
    });

    console.log('Archivo anterior eliminado de cloudinary:', result);
  } catch (error) {
    console.error('Error al eliminar el archivo en Cloudinary', error);
  }
};

module.exports = { deleteFile };
