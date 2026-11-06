export const getServerSideProps = async () => {
    return {
      redirect: {
        destination: '/tobacco',
        permanent: false,
      },
    };
  };
  
  export default getServerSideProps