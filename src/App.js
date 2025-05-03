import { useContext, useState, Suspense, useEffect } from 'react'
import { AppBar, Material, Auth, Landing, ProjectView, GridDialog, ToolBar, CoordSysDialog } from './components'
import { UserContext, ProjectContext, ConfigContext } from './contexts'
import { calculateGrid } from './utils'

function App() {
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [gridDialogOpen, setGridDialogOpen] = useState(false);
  const [coordSysDialogOpen, setCoordSysDialogOpen] = useState(false);

  const [loggedUser, setLoggedUser] = useState(undefined);
  const [loadedProject, setLoadedProject] = useState(undefined);

  const [coordSystem, setCoordSystem] = useState(
    {x: 'X', y: 'Z', z: 'Y', xn: false, yn: false, zn: false}
  );

  const [gridStep, setGridStep] = useState({});
  const [gridCount, setGridCount] = useState({});
  const [gridPoints, setGridPoints] = useState([]);
  const [gridLines, setGridLines] = useState([]);
  const [resetGrid, setResetGrid] = useState(false);

  const [undoList, setUndoList] = useState([]);
  const [redoList, setRedoList] = useState([]);

  useEffect(() => {
    if (!loadedProject) {
      return;
    }
    setGridComponents(loadedProject.config.gridStep, loadedProject.config.gridCount);
  }, [loadedProject]);

  const createProject = () => {
    setLoadedProject({
      name: "Untitled0", 
      config: {gridStep: {x: 1.0, y: 1.0, z: 1.0}, gridCount: {x: 2, y: 2, z: 3}},
    });
  };

  const logout = () => {
    localStorage.removeItem("token")
    setLoggedUser(undefined);
  };

  const setGridComponents = (step, count) => {
    // console.log(step, count);
    setGridStep(step);
    setGridCount(count);
    const [pts, lns] = calculateGrid(step, count);
    setGridPoints(pts);
    setGridLines(lns);
  };

  const gridChanged = (oldval, newval) => {
    setUndoList([...undoList, {type: "grid", old: oldval, new: newval}]);
    setResetGrid(true);
  };

  const coordSystemChanged = (val) => {
    setUndoList([...undoList, {type: "coordsys", old: coordSystem, new: val}]);
    setCoordSystem(val);
  }

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
                  createProject={createProject}
                  materialDialog={setMaterialDialogOpen}
                  gridDialog={setGridDialogOpen}
                  coordSysDialog={setCoordSysDialogOpen}
                  logout={logout}
                />
                {!loadedProject && (              
                  <Landing createProject={createProject} />
                )}
                {loadedProject && (
                  <ConfigContext.Provider 
                    value={{gridStep, gridCount, gridPoints, gridLines, 
                    resetGrid, setResetGrid, coordSystem}}>
                    <>
                      <ToolBar
                        undoList={undoList}
                        redoList={redoList} />  
                      <Suspense fallback={<div>Loading...</div>}>
                        <ProjectView></ProjectView>
                      </Suspense>
                      { gridDialogOpen && (
                        <GridDialog
                          open={setGridDialogOpen}
                          grid={setGridComponents}
                          coordSystem={coordSystem}
                          values={{spacing: gridStep, count: gridCount}}
                          change={gridChanged} /> 
                      )}
                      { coordSysDialogOpen && (
                        <CoordSysDialog
                          open={setCoordSysDialogOpen}
                          coordSystem={coordSystem}
                          change={coordSystemChanged} /> 
                      )}
                    </>
                  </ConfigContext.Provider>
                )}
              </ProjectContext.Provider> 
          </>        
        )}
      </UserContext.Provider>      
    </div>
  );
}

export default App;
