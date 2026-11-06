export const getServerSideProps = async () => {
    return {
      redirect: {
        destination: '/about',
        permanent: true,
      },
    };
  };

export default getServerSideProps