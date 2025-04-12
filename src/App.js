import { useContext, useState, Suspense, useEffect } from 'react'
import { AppBar, Material, Auth, Landing, ProjectView } from './components'
import { UserContext, ProjectContext, GridContext } from './contexts'
import { calculateGrid } from './utils'

function App() {
  const [materialMenuOpen, setMaterialMenuOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState(undefined);
  const [loadedProject, setLoadedProject] = useState(undefined);
  const [gridStep, setGridStep] = useState({});
  const [gridCount, setGridCount] = useState({});
  const [gridPoints, setGridPoints] = useState([]);
  const [gridLines, setGridLines] = useState([]);

  const createProject = () => {
    setLoadedProject({
      name: "Untitled0", 
      config: {gridStep: {x: 1.0, y: 1.0, z: 1.0}, gridCount: {x: 2, y: 2, z: 3}},

    });
  };

  const openGridDialog = () => {
    console.log("grid opened");
  };

  useEffect(() => {
    if (!loadedProject) {
      return;
    }
    setGridStep(loadedProject.config.gridStep);
    setGridCount(loadedProject.config.gridCount);
    const [pts, lns] = calculateGrid(loadedProject.config.gridStep, loadedProject.config.gridCount);
    setGridPoints(pts);
    setGridLines(lns);
  }, [loadedProject]);

  return (
    <div className="App">
      <UserContext.Provider value={{loggedUser, setLoggedUser}}>
        {!loggedUser && (          
            <Auth />
        )}
        {loggedUser && (
          <>            
              <ProjectContext.Provider value={{loadedProject, setLoadedProject}}>
                <AppBar
                  materialOpen={setMaterialMenuOpen}
                  createProject={createProject}
                  openGridDialog={openGridDialog}
                />
                {!loadedProject && (              
                  <Landing createProject={createProject} />
                )}
                {loadedProject && (
                  <GridContext.Provider 
                    value={{gridStep, gridCount, gridPoints, gridLines}}>
                    <Suspense fallback={<div>Loading...</div>}>
                      <ProjectView></ProjectView>
                    </Suspense>
                  </GridContext.Provider>
                  
                )}
              </ProjectContext.Provider> 
          </>        
        )}
      </UserContext.Provider>      
    </div>
  );
}

export default App;
