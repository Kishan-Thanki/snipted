export function AnimatedButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "relative overflow-hidden",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95",
        props.className
      )}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </Button>
  );
}