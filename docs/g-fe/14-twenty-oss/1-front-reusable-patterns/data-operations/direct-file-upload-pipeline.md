# Direct File Upload Pipeline

GraphQL로 upload target을 만들고, signed URL에 `PUT`한 뒤, complete mutation으로 파일 record를 확정하는 패턴이다.

핵심은 `create target -> PUT bytes -> complete upload`이다.

## 1. 모듈 코드

- `src/modules/file/hooks/useDirectFileUpload.ts`: upload target 생성, signed URL PUT, complete mutation을 하나의 `uploadFile` 함수로 묶는다.
- `src/modules/object-record/record-field/ui/meta-types/hooks/useUploadFilesFieldFile.ts`: generic upload hook을 files field 전용 return shape과 snackbar로 감싼다.
- `src/modules/activities/files/hooks/useUploadAttachmentFile.tsx`: generic upload hook을 attachment record 생성 workflow에 연결한다.

```tsx
// filepath: src/modules/file/hooks/useDirectFileUpload.ts
import { useApolloClient, useMutation } from '@apollo/client/react';
import { isDefined } from 'twenty-shared/utils';
import {
  CompleteFileUploadDocument,
  CreateFileUploadDocument,
  type FileFolder,
  type FileWithSignedUrl,
} from '~/generated-metadata/graphql';

type DirectFileUploadOptions = {
  fileFolder: FileFolder;
  fieldMetadataId?: string;
  signal?: AbortSignal;
};

export const useDirectFileUpload = () => {
  const apolloClient = useApolloClient();
  const [createFileUpload] = useMutation(CreateFileUploadDocument, {
    client: apolloClient,
  });
  const [completeFileUpload] = useMutation(CompleteFileUploadDocument, {
    client: apolloClient,
  });

  const uploadFile = async (
    file: File,
    { fileFolder, fieldMetadataId, signal }: DirectFileUploadOptions,
  ): Promise<FileWithSignedUrl> => {
    const createResult = await createFileUpload({
      variables: {
        filename: file.name,
        size: file.size,
        fileFolder,
        fieldMetadataId,
      },
    });

    const uploadTarget = createResult?.data?.createFileUpload;

    if (!isDefined(uploadTarget)) {
      throw new Error('Failed to initiate file upload');
    }

    const putResponse = await fetch(uploadTarget.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': uploadTarget.contentType },
      body: file,
      credentials: 'omit',
      signal,
    });

    if (!putResponse.ok) {
      throw new Error(`File upload failed with status ${putResponse.status}`);
    }

    const completeResult = await completeFileUpload({
      variables: { fileId: uploadTarget.fileId },
    });

    const uploadedFile = completeResult?.data?.completeFileUpload;

    if (!isDefined(uploadedFile)) {
      throw new Error('Failed to finalize file upload');
    }

    return uploadedFile;
  };

  return { uploadFile };
};

// filepath: src/modules/object-record/record-field/ui/meta-types/hooks/useUploadFilesFieldFile.ts
import { useDirectFileUpload } from '@/file/hooks/useDirectFileUpload';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useLingui } from '@lingui/react/macro';
import { FileFolder } from '~/generated-metadata/graphql';

export const useUploadFilesFieldFile = () => {
  const { uploadFile: directUploadFile } = useDirectFileUpload();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { t } = useLingui();

  const uploadFile = async (file: File, fieldMetadataId: string) => {
    try {
      const uploadedFile = await directUploadFile(file, {
        fileFolder: FileFolder.FilesField,
        fieldMetadataId,
      });

      enqueueSuccessSnackBar({
        message: t`File "${file.name}" uploaded successfully`,
      });

      return {
        fileId: uploadedFile.id,
        label: file.name,
      };
    } catch (error) {
      enqueueErrorSnackBar({
        message: t`Failed to upload "${file.name}"`,
      });

      throw error;
    }
  };

  return { uploadFile };
};

// filepath: src/modules/activities/files/hooks/useUploadAttachmentFile.tsx
import { useDirectFileUpload } from '@/file/hooks/useDirectFileUpload';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { FileFolder } from '~/generated-metadata/graphql';

export const useUploadAttachmentFile = () => {
  const { uploadFile: directUploadFile } = useDirectFileUpload();
  const { createOneRecord: createOneAttachment } =
    useCreateOneRecord<Attachment>({
      objectNameSingular: CoreObjectNameSingular.Attachment,
      shouldMatchRootQueryFilter: true,
    });

  const uploadAttachmentFile = async (
    file: File,
    targetableObject: ActivityTargetableObject,
  ) => {
    const uploadedFile = await directUploadFile(file, {
      fileFolder: FileFolder.FilesField,
      fieldMetadataId: filesFieldMetadataId,
    });

    await createOneAttachment({
      name: file.name,
      [targetableObjectFieldIdName]: targetableObject.id,
      file: [{ fileId: uploadedFile.id, label: file.name }],
    });

    return {
      attachmentAbsoluteURL: uploadedFile.url,
      attachmentFileId: uploadedFile.id,
    };
  };

  return { uploadAttachmentFile };
};
```

## 2. 사용 예제

```tsx
import { useDirectFileUpload } from '@/file/hooks/useDirectFileUpload';
import { FileFolder } from '~/generated-metadata/graphql';

export const UploadLogoButton = ({ file }: { file: File }) => {
  const { uploadFile } = useDirectFileUpload();

  const handleUpload = async () => {
    const uploadedFile = await uploadFile(file, {
      fileFolder: FileFolder.WorkspaceLogo,
    });

    await updateWorkspace({ logo: uploadedFile.path });
  };

  return <button onClick={handleUpload}>Upload logo</button>;
};
```
