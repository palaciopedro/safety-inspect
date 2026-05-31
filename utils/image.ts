import * as ImageManipulator from 'expo-image-manipulator';

export const processImage = async (uri: string, mimeType?: string): Promise<string> => {
  const fileExtension = uri.toLowerCase().split('.').pop() ?? '';
  const isPng = mimeType?.toLowerCase().includes('png') || fileExtension === 'png';
  const format = isPng ? ImageManipulator.SaveFormat.PNG : ImageManipulator.SaveFormat.JPEG;
  const resultMimeType = isPng ? 'image/png' : 'image/jpeg';

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800, height: 800 } }],
    { compress: 0.7, format, base64: true }
  );
  return `data:${resultMimeType};base64,${result.base64}`;
};