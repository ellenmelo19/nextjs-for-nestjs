import clsx from "clsx";

type SpinLoaderProps = {
    className?: string;
};

export function SpinLoader({ className = '' }: SpinLoaderProps) {
    const classes = clsx(
        'flex',
        'justify-center',
        'items-center',
        className
    );

  return (
    <div className={classes}>
        <div className={clsx(
            'animate-spin',
            'rounded-full',
            'h-10',
            'w-10',
            'border-b-2',
            'border-blue-500'
        )}></div>
    </div>
  );
}