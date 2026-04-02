    export const renderImage = (image: any, forCart: boolean) => {
        if (!image) return null;

        const baseProps = {
            alt: "Product image",
            className: `object-contain rounded-md ${forCart? 'h-12' : ''}`,
        };

        if (typeof image === "string") {
            return (
                <img
                    src={"http://localhost:3000" + image}
                    {...baseProps}
                />
            );
        }

        if (typeof image === "object" && "url" in image && image.url) {
            return (
                <img
                    src={"http://localhost:3000" + image.url}
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