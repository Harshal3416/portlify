    export const renderImage = (image: any, forCart: boolean) => {
        if (!image) return '🖼️ ';

        const baseProps = {
            alt: "Product image",
            className: `object-contain  ${forCart? 'h-12' : ''}`,
        };

        if (typeof image === "string") {
            return (
                <img
                    src={process.env.NEXT_PUBLIC_BACKEND_URL + image}
                    {...baseProps}
                />
            );
        }

        if (typeof image === "object" && "url" in image && image.url) {
            return (
                <img
                    src={process.env.NEXT_PUBLIC_BACKEND_URL + image.url}
                    {...baseProps}
                />
            );
        }

        return (
            <img
                src={URL.createObjectURL(image as Blob)}
                {...baseProps}
            />
        );
    };