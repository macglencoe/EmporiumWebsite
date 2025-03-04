export const getServerSideProps = async () => {
    return {
      redirect: {
        destination: '/contact',
        permanent: true,
      },
    };
  };

  export default getServerSideProps