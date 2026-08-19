import Head from "next/head";
import Layout from "../components/layout";
import PageTitle1 from "../components/pagetitle1";

const ContactPage = (props) => {
    return(
        
        <>
        <Head>
            <title>Contact</title>
        </Head>
            <Layout>
                <PageTitle1>Contact Information</PageTitle1>
                <span><b>Phone: </b>+1 (304) 264 9130</span>
                <span><b>Email: </b>kingstreetemporium@gmail.com</span>
                <span><b>Location: </b>320 W King St, Martinsburg, WV 25401</span>
            </Layout>
        </>
    )
}

export default ContactPage