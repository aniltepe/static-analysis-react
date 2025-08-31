import { useContext, useState, Suspense, useEffect } from 'react'
import { AppBar, Auth, Landing, ProjectView, ToolBar, Snackbars } from './components'
import { MaterialDialog, GridDialog, CoordSysDialog, UnitDialog,
  NewMaterialDialog, FrameDialog, NewFrameDialog } from './dialogs'
import { UserContext, ProjectContext, ConfigContext, AppContext } from './contexts'
import { calculateGrid } from './utils'


function App() {
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [gridDialogOpen, setGridDialogOpen] = useState(false);
  const [coordSysDialogOpen, setCoordSysDialogOpen] = useState(false);
  const [newMaterialDialogOpen, setNewMaterialDialogOpen] = useState(false);
  const [frameDialogOpen, setFrameDialogOpen] = useState(false);
  const [newFrameDialogOpen, setNewFrameDialogOpen] = useState(false);

  const [dialog, setDialog] = useState({
    material: false, grid: false, coordSys: false, newMaterial: false, 
    frame: false, newFrame: false, unit: false, bc: false, 
  })

  const [loggedUser, setLoggedUser] = useState(undefined);
  const [loadedProject, setLoadedProject] = useState(undefined);

  const [coordSystem, setCoordSystem] = useState(
    {x: 'X', y: 'Y', z: 'Z', xn: false, yn: false, zn: false}
  );

  const [units, setUnits] = useState({
    force: "kip",
    length: "ft",
    temperature: "F"
  })

  const [gridStep, setGridStep] = useState({});
  const [gridCount, setGridCount] = useState({});
  const [gridPoints, setGridPoints] = useState([]);
  const [gridLines, setGridLines] = useState([]);
  const [resetGrid, setResetGrid] = useState(false);

  const [undoList, setUndoList] = useState([]);
  const [redoList, setRedoList] = useState([]);

  const [snackbars, setSnackbars] = useState([]);

  const [modelLines, setModelLines] = useState([]);
  const [materials, setMaterials] = useState([
    {id: "0", name: "Material1", type: "concrete", wpuv: 0.15, moe: 5119119.5, poisson: 0.2, sccs: 576.0},
    {id: "s1", name: "MaterialS1", type: "steel", wpuv: 0.19, moe: 10, poisson: 0.3, mts: 575.0, mys: 0.1},
    {id: "s2", name: "MaterialS2", type: "steel", wpuv: 0.19, moe: 11, poisson: 0.3, mts: 575.0, mys: 0.2},
    {id: "1", name: "Material2", type: "concrete", wpuv: 0.19, moe: 500000, poisson: 0.3, sccs: 575.0},
  ]);
  const [focusedMaterial, setFocusedMaterial] = useState();
  const [focusedFrame, setFocusedFrame] = useState();

  const [frameSections, setFrameSections] = useState([
    {id: "0", name: "Section1", type: "concrete", material: "0"},
    {id: "1", name: "Section2", type: "steel"},
  ]);

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
  };

  const materialFocused = (mat) => {
    setFocusedMaterial(mat);
    // setNewMaterialDialogOpen(true);
    setDialog({...dialog, newMaterial: true});
  };

  const frameSectionFocused = (fs) => {
    setFocusedFrame(fs);
    // setNewFrameDialogOpen(true);
    setDialog({...dialog, newFrame: true});
  };

  const addSnackbar = (sb) => {
    setSnackbars([...snackbars, sb]);
  };

  const removeSnackbar = (id) => {
    setSnackbars(snackbars.filter((sb) => {
      if (sb.id === id) {
        return false;
      }
      else {
        return true;
      }
    }));
  };

  return (
    <div className="App">
      <AppContext.Provider value={{snackbars, addSnackbar, removeSnackbar}}>
        <UserContext.Provider value={{loggedUser, setLoggedUser}}>
          {!loggedUser && (          
              <Auth />
          )}
          {loggedUser && (
            <ProjectContext.Provider value={{loadedProject, setLoadedProject,
              modelLines, setModelLines, materials, focusedMaterial, 
              frameSections, focusedFrame}}
            >
              <AppBar
                createProject={createProject}
                materialDialog={(e) => setDialog({...dialog, material: e})}
                gridDialog={(e) => setDialog({...dialog, grid: e})}
                coordSysDialog={(e) => setDialog({...dialog, coordSys: e})}
                frameDialog={(e) => setDialog({...dialog, frame: e})}
                unitDialog={(e) => setDialog({...dialog, unit: e})}
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
                    { dialog.grid && (
                      <GridDialog
                        open={(e) => setDialog({...dialog, grid: e})}
                        grid={setGridComponents}
                        coordSystem={coordSystem}
                        values={{spacing: gridStep, count: gridCount}}
                        change={gridChanged} /> 
                    )}
                    { dialog.coordSys && (
                      <CoordSysDialog
                        open={(e) => setDialog({...dialog, coordSys: e})}
                        coordSystem={coordSystem}
                        change={coordSystemChanged} /> 
                    )}
                    { dialog.material && (
                      <MaterialDialog 
                        open={(e) => setDialog({...dialog, material: e})}
                        focus={materialFocused}
                      /> 
                    )}
                    { dialog.frame && (
                      <FrameDialog 
                        open={(e) => setDialog({...dialog, frame: e})}
                        focus={frameSectionFocused}
                      /> 
                    )}
                    { dialog.newMaterial && (
                      <NewMaterialDialog 
                        open={(e) => setDialog({...dialog, newMaterial: e})}
                        focused={focusedMaterial}
                        setFocused={setFocusedMaterial}
                      /> 
                    )}
                    { dialog.newFrame && (
                      <NewFrameDialog 
                        open={(e) => setDialog({...dialog, newFrame: e})}
                        focused={focusedFrame}
                        setFocused={setFocusedFrame}
                        newMaterial={materialFocused}
                      /> 
                    )}
                    { dialog.unit && (
                      <UnitDialog 
                        open={(e) => setDialog({...dialog, unit: e})}
                        units={units}
                      /> 
                    )}
                  </>
                </ConfigContext.Provider>
              )}
            </ProjectContext.Provider>
          )}
        </UserContext.Provider>
        <Snackbars />
      </AppContext.Provider>
    </div>
  );
}

export default App;
