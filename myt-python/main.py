import sys
import json
import traceback
from common.mytRpc import MytRpc
from common.mytSelector import mytSelector
from common.rpcNode import rpcNode

class MytClient:
    def __init__(self):
        self.mytapi = MytRpc()
        
    def init(self, ip, port, timeout):
        try:
            return self.mytapi.init(ip, port, timeout)
        except Exception as e:
            return {"error": f"初始化失败: {str(e)}"}
            
    def get_sdk_version(self):
        try:
            return self.mytapi.get_sdk_version()
        except Exception as e:
            return {"error": f"获取SDK版本失败: {str(e)}"}
            
    def check_connect_state(self):
        try:
            return self.mytapi.check_connect_state()
        except Exception as e:
            return {"error": f"检查连接状态失败: {str(e)}"}
            
    def setRpaWorkMode(self, mode):
        try:
            return self.mytapi.setRpaWorkMode(mode)
        except Exception as e:
            return {"error": f"设置工作模式失败: {str(e)}"}
            
    def takeCaptrueCompress(self, quality, timeout):
        try:
            return self.mytapi.takeCaptrueCompress(quality, timeout)
        except Exception as e:
            return {"error": f"截图失败: {str(e)}"}
            
    def screentshot(self, type, quality, path):
        try:
            return self.mytapi.screentshot(type, quality, path)
        except Exception as e:
            return {"error": f"保存截图失败: {str(e)}"}
            
    def screentshotEx(self, x1, y1, x2, y2, type, quality, path):
        try:
            return self.mytapi.screentshotEx(x1, y1, x2, y2, type, quality, path)
        except Exception as e:
            return {"error": f"区域截图失败: {str(e)}"}
            
    def dumpNodeXml(self, include_invisible):
        try:
            return self.mytapi.dumpNodeXml(include_invisible)
        except Exception as e:
            return {"error": f"导出节点信息失败: {str(e)}"}
            
    def openApp(self, package_name):
        try:
            return self.mytapi.openApp(package_name)
        except Exception as e:
            return {"error": f"打开应用失败: {str(e)}"}
            
    def stopApp(self, package_name):
        try:
            return self.mytapi.stopApp(package_name)
        except Exception as e:
            return {"error": f"关闭应用失败: {str(e)}"}
            
    def sendText(self, text):
        try:
            return self.mytapi.sendText(text)
        except Exception as e:
            return {"error": f"发送文本失败: {str(e)}"}
            
    def ClearText(self, count):
        try:
            return self.mytapi.ClearText(count)
        except Exception as e:
            return {"error": f"清除文本失败: {str(e)}"}
            
    def exec_cmd(self, cmd):
        try:
            return self.mytapi.exec_cmd(cmd)
        except Exception as e:
            return {"error": f"执行命令失败: {str(e)}"}
            
    def touchDown(self, finger_id, x, y):
        try:
            return self.mytapi.touchDown(finger_id, x, y)
        except Exception as e:
            return {"error": f"按下触摸失败: {str(e)}"}
            
    def touchMove(self, finger_id, x, y):
        try:
            return self.mytapi.touchMove(finger_id, x, y)
        except Exception as e:
            return {"error": f"移动触摸失败: {str(e)}"}
            
    def touchUp(self, finger_id, x, y):
        try:
            return self.mytapi.touchUp(finger_id, x, y)
        except Exception as e:
            return {"error": f"抬起触摸失败: {str(e)}"}
            
    def swipe(self, finger_id, x1, y1, x2, y2, duration):
        try:
            return self.mytapi.swipe(finger_id, x1, y1, x2, y2, duration)
        except Exception as e:
            return {"error": f"滑动操作失败: {str(e)}"}
            
    def keyPress(self, keycode):
        try:
            return self.mytapi.keyPress(keycode)
        except Exception as e:
            return {"error": f"按键操作失败: {str(e)}"}
            
    def getNodeByClass(self, class_name):
        try:
            return self.mytapi.getNodeByClass(class_name)
        except Exception as e:
            return {"error": f"获取节点失败: {str(e)}"}
            
    def getNodeByText(self, text):
        try:
            return self.mytapi.getNodeByText(text)
        except Exception as e:
            return {"error": f"根据文本获取节点失败: {str(e)}"}
            
    def getNodeByTextMatchEnd(self, text):
        try:
            return self.mytapi.getNodeByTextMatchEnd(text)
        except Exception as e:
            return {"error": f"根据文本结尾匹配获取节点失败: {str(e)}"}
            
    def getNodeByTextMatchStart(self, text):
        try:
            return self.mytapi.getNodeByTextMatchStart(text)
        except Exception as e:
            return {"error": f"根据文本开头匹配获取节点失败: {str(e)}"}
            
    def getNodeByPkg(self, pkg):
        try:
            return self.mytapi.getNodeByPkg(pkg)
        except Exception as e:
            return {"error": f"根据包名获取节点失败: {str(e)}"}
            
    def getNodeById(self, id):
        try:
            return self.mytapi.getNodeById(id)
        except Exception as e:
            return {"error": f"根据ID获取节点失败: {str(e)}"}
            
    def getNodeByDesc(self, desc):
        try:
            return self.mytapi.getNodeByDesc(desc)
        except Exception as e:
            return {"error": f"根据描述获取节点失败: {str(e)}"}
            
    def clickText(self, text):
        try:
            return self.mytapi.clickText(text)
        except Exception as e:
            return {"error": f"点击文本失败: {str(e)}"}
            
    def clickTextMatchStart(self, text):
        try:
            return self.mytapi.clickTextMatchStart(text)
        except Exception as e:
            return {"error": f"点击匹配开头的文本失败: {str(e)}"}
            
    def clickClass(self, clzName):
        try:
            return self.mytapi.clickClass(clzName)
        except Exception as e:
            return {"error": f"点击类名失败: {str(e)}"}
            
    def clickId(self, id):
        try:
            return self.mytapi.clickId(id)
        except Exception as e:
            return {"error": f"点击ID失败: {str(e)}"}
            
    def clickDesc(self, des):
        try:
            return self.mytapi.clickDesc(des)
        except Exception as e:
            return {"error": f"点击描述失败: {str(e)}"}
            
    def pressBack(self):
        try:
            return self.mytapi.pressBack()
        except Exception as e:
            return {"error": f"按下返回键失败: {str(e)}"}
            
    def pressEnter(self):
        try:
            return self.mytapi.pressEnter()
        except Exception as e:
            return {"error": f"按下回车键失败: {str(e)}"}
            
    def pressHome(self):
        try:
            return self.mytapi.pressHome()
        except Exception as e:
            return {"error": f"按下Home键失败: {str(e)}"}
            
    def pressRecent(self):
        try:
            return self.mytapi.pressRecent()
        except Exception as e:
            return {"error": f"按下最近任务键失败: {str(e)}"}
            
    def touchClick(self, finger_id, x, y):
        try:
            return self.mytapi.touchClick(finger_id, x, y)
        except Exception as e:
            return {"error": f"点击触摸失败: {str(e)}"}
            
    def longClick(self, finger_id, x, y, t):
        try:
            return self.mytapi.longClick(finger_id, x, y, t)
        except Exception as e:
            return {"error": f"长按失败: {str(e)}"}
            
    def getDisplayRotate(self):
        try:
            return self.mytapi.getDisplayRotate()
        except Exception as e:
            return {"error": f"获取屏幕旋转方向失败: {str(e)}"}
            
    def dumpNodeXmlEx(self, workMode, timeout):
        try:
            return self.mytapi.dumpNodeXmlEx(workMode, timeout)
        except Exception as e:
            return {"error": f"导出节点XML信息失败: {str(e)}"}
            
    def takeCaptrueCompressEx(self, left, top, right, bottom, type, quality):
        try:
            return self.mytapi.takeCaptrueCompressEx(left, top, right, bottom, type, quality)
        except Exception as e:
            return {"error": f"指定区域截图失败: {str(e)}"}
            
    def startVideoStream(self):
        try:
            return self.mytapi.startVideoStream()
        except Exception as e:
            return {"error": f"启动视频流失败: {str(e)}"}

def convert_params(method_name, params):
    """Convert parameters to their correct types based on the method name."""
    if not params:
        return params
        
    # Methods that need integer parameters
    int_params = {
        'init': [1, 2],  # port, timeout
        'setRpaWorkMode': [0],  # mode
        'takeCaptrueCompress': [0, 1],  # quality, timeout
        'screentshot': [0, 1],  # quality
        'screentshotEx': [0, 1, 2, 3, 4, 5],  # x1, y1, x2, y2, quality
        'ClearText': [0],  # count
        'touchDown': [0, 1, 2],  # finger_id, x, y
        'touchMove': [0, 1, 2],  # finger_id, x, y
        'touchUp': [0, 1, 2],  # finger_id, x, y
        'swipe': [0, 1, 2, 3, 4, 5],  # finger_id, x1, y1, x2, y2, duration
        'keyPress': [0],  # keycode
        'dumpNodeXml': [0],  # include_invisible
    }
    
    if method_name in int_params:
        for idx in int_params[method_name]:
            if idx < len(params):
                try:
                    params[idx] = int(params[idx])
                except ValueError:
                    raise ValueError(f"参数 {idx+1} 需要是整数类型")
    
    return params

def main():
    try:
        # 检查参数
        if len(sys.argv) < 2:
            print(json.dumps({"error": "参数错误，格式: <method> [params...] [deviceIp] [devicePort] [deviceTimeout]"}))
            sys.exit(1)
            
        method_name = sys.argv[1]
        params = sys.argv[2:]

        client = MytClient()
        
        # 如果不是 init 或 get_sdk_version 方法，需要先初始化
        if method_name != "init" and method_name != "get_sdk_version":
            if len(params) < 3:
                print(json.dumps({"error": "非初始化方法调用需要提供设备参数: <method> [params...] <deviceIp> <devicePort> <deviceTimeout>"}))
                sys.exit(1)
                
            # 分离设备参数和实际参数
            device_params = params[-3:]
            params = params[:-3]
            
            # 转换设备参数类型
            try:
                device_params = convert_params("init", device_params)
            except ValueError as e:
                print(json.dumps({"error": f"设备参数错误: {str(e)}"}))
                sys.exit(1)
            
            # 先初始化连接
            init_result = client.init(*device_params)
            if isinstance(init_result, dict) and "error" in init_result:
                print(json.dumps(init_result))
                sys.exit(1)
        
        # 转换实际参数类型
        try:
            params = convert_params(method_name, params)
        except ValueError as e:
            print(json.dumps({"error": f"方法参数错误: {str(e)}"}))
            sys.exit(1)
        
        # 调用目标方法
        if hasattr(client, method_name):
            method = getattr(client, method_name)
            result = method(*params)
            print(json.dumps({"result": result}))
        else:
            print(json.dumps({"error": f"方法 {method_name} 不存在"}))
            sys.exit(1) 
            
    except Exception as e:
        error_info = {
            "error": "内部错误",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_info))
        sys.exit(1)

if __name__ == "__main__":
    main() 