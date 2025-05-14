export const LoadingFallback: React.FC = () => {
  return (
    <div className="h-[80vh] w-full flex flex-col justify-center items-center pt-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};
