import subprocess
import os
import sys

def start_app():
    # 获取当前脚本/可执行文件所在目录
    if getattr(sys, 'frozen', False):
        # 如果是打包后的 exe
        project_dir = os.path.dirname(sys.executable)
    else:
        # 如果是直接运行脚本
        project_dir = os.path.dirname(os.path.abspath(__file__))
    
    os.chdir(project_dir)
    
    # 打印启动提示
    print("-" * 50)
    print("CoderPro 启动器")
    print(f"工作目录: {project_dir}")
    print("-" * 50)

    try:
        # 检查 node_modules 是否存在
        if not os.path.exists(os.path.join(project_dir, 'node_modules')):
            print("正在安装依赖项，请稍候...")
            subprocess.run(["npm", "install"], shell=True, check=True)

        # 运行启动命令
        print("正在启动开发服务器和 Electron...")
        # shell=True 是在 Windows 上运行 npm 命令所必需的
        subprocess.run(["npm", "run", "electron:dev"], shell=True, check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"\n[错误] 程序运行出错: {e}")
    except FileNotFoundError:
        print("\n[错误] 未找到 'npm' 命令。请确保已安装 Node.js 并且已将其添加到系统环境变量中。")
    except KeyboardInterrupt:
        print("\n[信息] 用户停止了程序。")

if __name__ == "__main__":
    start_app()
