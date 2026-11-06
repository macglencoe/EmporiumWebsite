export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/cigars',
      permanent: true,
    },
  };
};

export default getServerSideProps