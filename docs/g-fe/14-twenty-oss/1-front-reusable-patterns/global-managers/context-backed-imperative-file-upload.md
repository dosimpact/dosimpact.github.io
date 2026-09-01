# Context-backed Imperative File Upload

React Context로 hidden file input을 전역 서비스처럼 열어주는 패턴이다.

핵심은 `Provider owns the mechanism, caller owns the behavior`다.

## 1. 모듈 코드

- `src/modules/file-upload/contexts/FileUploadContext.ts`: provider가 노출할 `openFileUpload` API와 options 타입을 정의한다.
- `src/modules/file-upload/hooks/useFileUpload.ts`: 하위 컴포넌트가 Context 값을 가져오고 provider 누락을 빠르게 에러로 드러낸다.
- `src/modules/file-upload/components/FileUploadProvider.tsx`: hidden file input을 소유하고 `openFileUpload(options)` 호출을 실제 파일 선택 동작으로 연결한다.
- `src/modules/ui/layout/page/components/DefaultLayout.tsx`: 앱 페이지 트리를 `FileUploadProvider`로 감싸 어디서든 hook을 쓸 수 있게 한다.

```tsx
// filepath: src/modules/file-upload/contexts/FileUploadContext.ts
import { createContext } from 'react';

export type FileUploadCallback = (files: File[]) => void | Promise<void>;

export type FileUploadOptions = {
  multiple?: boolean;
  accept?: string;
  onUpload: FileUploadCallback;
  onCancel?: () => void;
};

export type FileUploadContextValue = {
  openFileUpload: (options: FileUploadOptions) => void;
};

export const FileUploadContext = createContext<FileUploadContextValue | null>(
  null,
);

// filepath: src/modules/file-upload/hooks/useFileUpload.ts
import { FileUploadContext } from '@/file-upload/contexts/FileUploadContext';
import { useContext } from 'react';

export const useFileUpload = () => {
  const context = useContext(FileUploadContext);

  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }

  return context;
};

// filepath: src/modules/file-upload/components/FileUploadProvider.tsx
import {
  FileUploadContext,
  type FileUploadOptions,
} from '@/file-upload/contexts/FileUploadContext';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

const StyledFileInput = styled.input`
  display: none;
`;

export const FileUploadProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadOptions, setUploadOptions] = useState<FileUploadOptions | null>(
    null,
  );

  const openFileUpload = useCallback((options: FileUploadOptions) => {
    setUploadOptions(options);

    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  }, []);

  const handleFileInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const currentOptions = uploadOptions;

      if (!isDefined(currentOptions)) {
        return;
      }

      try {
        if (!isDefined(files) || files.length === 0) {
          currentOptions.onCancel?.();
        } else {
          const filesArray = Array.from(files);
          await currentOptions.onUpload(filesArray);
        }
      } finally {
        if (isDefined(fileInputRef.current)) {
          fileInputRef.current.value = '';
        }
        setUploadOptions(null);
      }
    },
    [uploadOptions],
  );

  const handleFileInputCancel = useCallback(() => {
    const currentOptions = uploadOptions;

    if (!isDefined(currentOptions)) {
      return;
    }

    try {
      currentOptions.onCancel?.();
    } finally {
      if (isDefined(fileInputRef.current)) {
        fileInputRef.current.value = '';
      }
      setUploadOptions(null);
    }
  }, [uploadOptions]);

  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) {
      return;
    }

    input.addEventListener('cancel', handleFileInputCancel);
    return () => input.removeEventListener('cancel', handleFileInputCancel);
  }, [handleFileInputCancel]);

  return (
    <FileUploadContext.Provider value={{ openFileUpload }}>
      {children}
      <StyledFileInput
        ref={fileInputRef}
        type="file"
        multiple={uploadOptions?.multiple ?? false}
        accept={uploadOptions?.accept}
        onChange={handleFileInputChange}
      />
    </FileUploadContext.Provider>
  );
};

// filepath: src/modules/ui/layout/page/components/DefaultLayout.tsx
import { FileUploadProvider } from '@/file-upload/components/FileUploadProvider';
import { Outlet } from 'react-router-dom';

export const DefaultLayout = () => {
  return (
    <FileUploadProvider>
      <Outlet />
    </FileUploadProvider>
  );
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/record-field/ui/meta-types/input/components/FilesFieldInput.tsx
import { useFileUpload } from '@/file-upload/hooks/useFileUpload';
import { useCallback, useState } from 'react';

export const FilesFieldInput = () => {
  const { openFileUpload } = useFileUpload();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = useCallback(() => {
    if (isUploading) {
      return;
    }

    openFileUpload({
      multiple: true,
      onUpload: async (selectedFiles: File[]) => {
        setIsUploading(true);

        try {
          const uploadedFiles = await uploadMultipleFiles(
            selectedFiles,
            fieldDefinition.fieldMetadataId,
            uploadFile,
          );

          if (uploadedFiles.length > 0) {
            const newFiles = [...files, ...uploadedFiles];
            handleChange(newFiles);
            onEnter?.({ newValue: parseFilesArrayToFilesValue(newFiles) });
          }
        } finally {
          setIsUploading(false);
        }
      },
    });
  }, [
    isUploading,
    openFileUpload,
    files,
    uploadFile,
    handleChange,
    onEnter,
    parseFilesArrayToFilesValue,
    fieldDefinition,
  ]);

  return <button onClick={handleUploadClick}>Upload file</button>;
};
```
