const SingleImageDisplay = ({ blob }: { blob: Blob; fileName: string }) => {
  return (
    <div className="mx-auto w-full border">
      <img
        src={URL.createObjectURL(blob)}
        alt="Single Display"
        className="mx-auto aspect-auto w-full object-cover"
      />
    </div>
  )
}

export default SingleImageDisplay
