
export const getStaticProps = async () => {
    const data = await import('/public/data/consolidated_cigars.json');
    return {
      props: {
        data: data.default
      },
    };
  };

const setLocalData = (data) => {
    if (typeof window !== 'undefined') {
        if (!localStorage.getItem('tempData_cigars')) {
            localStorage.setItem('tempData_cigars', JSON.stringify(data));
        }
    }
}

export default setLocalData