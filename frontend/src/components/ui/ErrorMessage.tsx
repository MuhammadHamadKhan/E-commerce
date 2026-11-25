// ErrorMessage: red box shown when a request fails.
export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-center gap-sm rounded-md border border-error/30 bg-error-container/40 px-md py-sm text-body-sm text-error">
      <span aria-hidden="true">⚠</span>
      <p>{message}</p>
    </div>
  );
}
