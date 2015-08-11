package com.wavemaker.runtime.file.manager;

import com.wavemaker.studio.common.util.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


@Service
public class FileServiceManager {


    /**
     * Delegate method for java service upload method.
     * <p/>
     * PARAMS:
     * file : multipart file to be uploaded.
     * relativePath : This is the relative path where file will be uploaded.
     * uploadDirectory : The directory to which the file needs to be uploaded.
     * <p/>
     *
     * @return File
     * ******************************************************************************
     */
    public File uploadFile(MultipartFile file, String targetFilename, String relativePath, File uploadDirectory) throws IOException {
        File targetDir = uploadDirectory;
        if (StringUtils.isNotBlank(relativePath)) {
            relativePath = relativePath.trim();
            targetDir = new File(uploadDirectory.getAbsolutePath(), relativePath);

            /* Find our upload directory, make sure it exists */
            if (!targetDir.exists())
                targetDir.mkdirs();
        }

        File outputFile = createUniqueFile(targetFilename, targetDir);

                       /* Write the file to the filesystem */
        FileOutputStream fos = new FileOutputStream(outputFile);
        IOUtils.copy(file.getInputStream(), fos, true, true);

        return outputFile;
    }

    public File createUniqueFile(String originalFileName, File dir) {
    /* Create a file object that does not point to an existing file.
     * Loop through names until we find a filename not already in use */
        boolean hasExtension = originalFileName.indexOf(".") != -1;
        String name = (hasExtension) ?
                originalFileName.substring(0, originalFileName.lastIndexOf(".")) : originalFileName;
        String ext = (hasExtension) ?
                originalFileName.substring(originalFileName.lastIndexOf(".")) : "";

        File outputFile = new File(dir, originalFileName);
        for (int i = 0; i < 10000 && outputFile.exists(); i++) {
            outputFile = new File(dir, name + i + ext);
        }
        return outputFile;
    }


    /**
     * *****************************************************************************
     * NAME: listFiles
     * DESCRIPTION:
     * Returns a description of every file in the uploadDir.
     * RETURNS array of File
     * ******************************************************************************
     */
    public File[] listFiles(File uploadDirectory) throws IOException {

      /* Get a list of files; ignore any filename starting with "." as these are
       * typically private or temporary files not for users to interact with
       */
        File[] files = uploadDirectory.listFiles(
                new java.io.FilenameFilter() {
                    public boolean accept(File dir, String name) {
                        return (name.indexOf(".") != 0);
                    }
                });


        return files;
    }

    /**
     * *****************************************************************************
     * NAME: deleteFile
     * DESCRIPTION:
     * Deletes the files with the given path or name.  If the parameters are just file
     * names, it will look for files of that name in the uploadDir.  If its a full path
     * will delete the file at that path IF that path is within the uploadDir.
     * RETURNS boolean to indicate if success or failure of operation.
     * **************************************************************************
     */
    public boolean deleteFile(String file, File uploadDirectory) throws IOException {
        File dir = uploadDirectory;
        File f = (file.startsWith("/")) ? new File(file) : new File(dir, file);
        boolean deleteFileResponse = false;

        // verify that the path specified by the server is a valid path, and not, say,
        // your operating system, or your .password file.
        if (f.getAbsolutePath().indexOf(dir.getAbsolutePath()) == 0) {
            deleteFileResponse = f.delete();
        }
        return deleteFileResponse;
    }

    /**
     * *****************************************************************************
     * NAME: downloadFile
     * DESCRIPTION:
     * The specified file will be downloaded to the user's computer.
     * - file: filename (if the file is in uploadDir) or path
     * - filename: Optional string; if used, then this is the name that the user will see
     * for the downloaded file.  Else its name matches whats on the server.
     * PARAMS:
     * file : name of the file to be uploaded.
     * uploadDirectory : The directory where the file resides.
     * RETURNS File
     * **************************************************************************
     */
    public File downloadFile(String file, File uploadDirectory) throws Exception {
        File dir = uploadDirectory;
        File f = (file.startsWith("/")) ? new File(file) : new File(dir, file);

        // verify that the path specified by the server is a valid path, and not, say,
        // your .password file.
        if (f.getAbsolutePath().indexOf(dir.getAbsolutePath()) != 0)
            throw new Exception("File not in uploadDir");

        return f;
    }

}
