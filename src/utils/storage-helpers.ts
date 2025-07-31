
/**
 * storage-helpers.ts
 * ----------------
 * Utilidades para persistencia y manejo de datos.
 * Incluye localStorage y operaciones de archivo.
 */

/**
 * Lee un valor de localStorage.
 * Maneja errores y valores por defecto.
 * 
 * @param key - Clave de localStorage
 * @param defaultValue - Valor por defecto
 * @returns Valor parseado o defaultValue
 * 
 * @example
 * const config = getFromStorage('app-config', defaultConfig);
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    // Leer y parsear valor
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    // Error = usar default
    console.warn(`Failed to parse localStorage item "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Guarda un valor en localStorage.
 * Serializa a JSON y maneja errores.
 * 
 * @param key - Clave de localStorage
 * @param value - Valor a guardar
 * @returns true si se guardó correctamente
 * 
 * @example
 * if (setToStorage('app-config', config)) {
 *   // Guardado exitoso
 * }
 */
export function setToStorage<T>(key: string, value: T): boolean {
  try {
    // Serializar y guardar
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    // Error = no guardado
    console.warn(`Failed to save to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Elimina una clave de localStorage.
 * Maneja errores de forma segura.
 * 
 * @param key - Clave a eliminar
 * @returns true si se eliminó correctamente
 * 
 * @example
 * if (removeFromStorage('temp-data')) {
 *   // Eliminado exitoso
 * }
 */
export function removeFromStorage(key: string): boolean {
  try {
    // Eliminar clave
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    // Error = no eliminado
    console.warn(`Failed to remove localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Descarga datos como archivo JSON.
 * Crea un Blob y simula click en link.
 * 
 * @param data - Datos a descargar
 * @param filename - Nombre del archivo
 * 
 * @example
 * downloadJSON(projectData, 'project-backup.json');
 */
export function downloadJSON<T>(data: T, filename: string): void {
  // Crear blob con datos
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  
  // Crear y simular click en link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Limpiar recursos
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lee un archivo JSON.
 * Usa FileReader y Promise para async.
 * 
 * @param file - Archivo a leer
 * @returns Promise con datos parseados
 * 
 * @example
 * const data = await readJSONFile(file);
 * // Usar datos importados
 */
export function readJSONFile<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Handler de éxito
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as T;
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    // Handler de error
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    // Iniciar lectura
    reader.readAsText(file);
  });
}