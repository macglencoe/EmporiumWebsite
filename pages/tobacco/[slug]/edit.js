import { useRouter } from "next/router";
import { useMemo } from "react";
import { buildSchemaArtifacts } from "../../../utils/schemaMapper";

export const getStaticPaths = async () => {
    const tobaccos = await import("../../../public/data/tobacco.json");
    const data = await tobaccos.default;
    const paths = data.map((tobacco) => ({
        params: { slug: tobacco.slug },
    }));
    return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
    const tobaccosData = await import("../../../public/data/tobacco.json");
    const data = await tobaccosData.default;
    const tobaccoIndex = data.findIndex((tobacco) => tobacco.slug === params.slug);
    const tobacco = data[tobaccoIndex];
    const prevTobacco = tobaccoIndex > 0 ? data[tobaccoIndex - 1] : null;
    const nextTobacco = tobaccoIndex + 1 < data.length ? data[tobaccoIndex + 1] : null;
    return { props: {tobacco, next: nextTobacco, prev: prevTobacco, allTobacco: data } };
}

const EditTobaccoPage = ({ tobacco, allTobacco }) => {
    const router = useRouter();
    if (!tobacco) {
        return <div>Tobacco Not Found</div>
    }
    
    return <div>{tobacco.slug}</div>
}

export default EditTobaccoPage