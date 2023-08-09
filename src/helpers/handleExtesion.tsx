import {
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
} from '@ant-design/icons';

export const handleExtension = (name: string) => {
  const ext = name.split('.').pop();
  if (ext === 'txt') {
    return <FileTextOutlined className="text-3xl" />;
  }
  if (ext === 'pdf') {
    return <FilePdfOutlined className="text-3xl text-red-600" />;
  }
  if (ext && ['doc', 'docx', 'odt'].includes(ext)) {
    return <FileWordOutlined className="text-3xl text-blue-600" />;
  }
  if (ext && ['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
    return <FileExcelOutlined className="text-3xl text-emerald-600" />;
  }
  if (ext && ['ppt', 'pptx', 'odp'].includes(ext)) {
    return <FilePptOutlined className="text-3xl text-orange-600" />;
  }
  if (ext && ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff'].includes(ext)) {
    return <FileImageOutlined className="text-3xl text-orange-600" />;
  }
  return <FileUnknownOutlined className="text-3xl text-gray-600" />;
};
