export default function ReverseSplitLayout({ children, ...props }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8" {...props}>
            {/* Reverse usually implies order, so we can flip columns on mobile/desktop if needed, 
                but for a stub we'll keep it simple or use md:direction-reverse if we want to be fancy. */}
            <div className="flex flex-col-reverse md:contents">
                {children}
            </div>
        </div>
    );
}
