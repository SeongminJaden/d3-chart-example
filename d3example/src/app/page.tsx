// pages/index.tsx
import LineChart from './components/LineChart';
import data from './data';

const Home: React.FC = () => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ width: '50%' }}>
                <h2>Without Spline</h2>
                <LineChart data={data} useSpline={false} color="steelblue" />
            </div>
            <div style={{ width: '50%' }}>
                <h2>With Spline</h2>
                <LineChart data={data} useSpline={true} color="red" />
            </div>
        </div>
    </div>
);

export default Home;
