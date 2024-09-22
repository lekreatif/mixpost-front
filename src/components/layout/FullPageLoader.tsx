import Logo from './Logo'

export const FullPageLoader = () => {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <div className="h-12 w-12 animate-pulse">
        <Logo />
      </div>
    </div>
  )
}
