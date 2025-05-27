import ImageUploader from "../components/ImageUploader";

export default function UpLoadingImage() {
  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ImageUploader />
      </div>
    </div>
  );
}
