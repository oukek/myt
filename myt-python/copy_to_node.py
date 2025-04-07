import os
import shutil
import sys
import platform
from pathlib import Path

def copy_files():
    # 获取当前脚本所在目录
    current_dir = Path(__file__).parent
    # 获取目标目录（myt-node/src/myt-python）
    target_dir = current_dir.parent / 'myt-node' / 'src' / 'python'
    
    # 确保目标目录存在
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # 源目录（PyInstaller输出目录）
    source_dir = current_dir / 'dist'
    
    # 复制所有文件
    if source_dir.exists():
        for item in source_dir.iterdir():
            target_path = target_dir / item.name
            if item.is_dir():
                shutil.copytree(item, target_path, dirs_exist_ok=True)
            else:
                shutil.copy2(item, target_path)
        
        # 在macOS下需要给可执行文件添加执行权限
        if platform.system() == 'Darwin':
            executable = target_dir / 'myt-python'
            if executable.exists():
                executable.chmod(0o755)
        
        print(f"Successfully copied files from {source_dir} to {target_dir}")
    else:
        print(f"Source directory {source_dir} does not exist")
        sys.exit(1)

if __name__ == '__main__':
    copy_files() 