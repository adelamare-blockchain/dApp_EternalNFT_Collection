// import Loader from 'react-loader-spinner';

export default function Loader() {
  return (
    <div
      className='flex justify-center items-center pt-12'
      type='TailSpin'
      color='#d3d3d3'
      height={40}
      width={40}>
      Loading...
    </div>
  );
}
