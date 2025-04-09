import sys
import json
import traceback
import socket
import threading
import time
import gc
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
            
    def close(self):
        """关闭MytRpc实例，释放资源"""
        try:
            # 不直接访问内部属性，而是使用引用置空来触发垃圾回收
            # Python会在mytapi对象没有引用时自动调用其__del__方法
            # 在__del__方法中，MytRpc会自动调用closeDevice释放资源
            
            # 将引用置为None，让Python的垃圾回收器处理
            self.mytapi = None
            
            return {"success": True}
        except Exception as e:
            return {"error": f"关闭RPC连接失败: {str(e)}"}

class MytSocketServer:
    def __init__(self, host='0.0.0.0', port=8899):
        self.host = host
        self.port = port
        self.server_socket = None
        self.running = False
        # 存储设备连接的字典，键为设备IP，值为MytClient实例
        self.clients = {}
        # 用于保护clients字典的锁
        self.clients_lock = threading.Lock()
        
    def start(self):
        """启动Socket服务器"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            # 设置端口复用
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            self.running = True
            
            print(f"服务器已启动，监听 {self.host}:{self.port}")
            
            # 启动接受连接的线程
            accept_thread = threading.Thread(target=self.accept_connections)
            accept_thread.daemon = True
            accept_thread.start()
            
            # 主线程保持运行
            while self.running:
                time.sleep(1)
                
        except Exception as e:
            print(f"启动服务器失败: {str(e)}")
            self.stop()
            
    def stop(self):
        """停止Socket服务器"""
        self.running = False
        
        # 关闭所有客户端连接
        with self.clients_lock:
            for client_ip in list(self.clients.keys()):
                try:
                    self.clients[client_ip].close()
                except:
                    pass
            self.clients.clear()
                
        # 关闭服务器socket
        if self.server_socket:
            try:
                self.server_socket.close()
            except:
                pass
        
        # 手动触发垃圾回收
        gc.collect()
        print("服务器已停止")
        
    def accept_connections(self):
        """接受客户端连接"""
        while self.running:
            try:
                client_socket, client_address = self.server_socket.accept()
                print(f"接受连接: {client_address}")
                
                # 为每个客户端创建一个处理线程
                client_thread = threading.Thread(
                    target=self.handle_client,
                    args=(client_socket, client_address)
                )
                client_thread.daemon = True
                client_thread.start()
                
            except Exception as e:
                if self.running:
                    print(f"接受连接时出错: {str(e)}")
                    time.sleep(1)
                    
    def handle_client(self, client_socket, client_address):
        """处理客户端请求"""
        print(f"开始处理客户端 {client_address} 的请求")
        
        buffer = b""
        delimiter = b"\n"  # 使用换行符作为消息分隔符
        
        try:
            while self.running:
                # 接收数据
                data = client_socket.recv(4096)
                if not data:
                    print(f"客户端 {client_address} 断开连接")
                    break
                    
                buffer += data
                
                # 处理完整消息
                while delimiter in buffer:
                    # 分割消息
                    message, buffer = buffer.split(delimiter, 1)
                    
                    # 解析并处理消息
                    response = self.process_message(message, client_address)
                    
                    # 发送响应
                    response_data = json.dumps(response).encode('utf-8') + delimiter
                    client_socket.sendall(response_data)
                    
        except Exception as e:
            print(f"处理客户端 {client_address} 请求时出错: {str(e)}")
            traceback.print_exc()
            
        finally:
            # 清理连接
            try:
                client_socket.close()
            except:
                pass
                
    def process_message(self, message_bytes, client_address):
        """处理客户端发送的消息"""
        try:
            # 解析消息
            message_str = message_bytes.decode('utf-8')
            message = json.loads(message_str)
            
            method_name = message.get('method')
            params = message.get('params', [])
            request_id = message.get('id')  # 获取客户端请求ID
            
            print(f"收到请求: method={method_name}, params={params}, id={request_id}")
            
            # 特殊命令: 关闭服务器
            if method_name == "shutdown_server":
                threading.Thread(target=self.stop).start()
                return {"result": "服务器关闭中", "id": request_id}
                
            # 处理MytClient方法调用
            response = self.handle_method_call(method_name, params, client_address)
            # 在响应中添加请求ID
            response["id"] = request_id
            return response
            
        except json.JSONDecodeError:
            return {"error": "无效的JSON格式"}
        except Exception as e:
            print(f"处理消息时出错: {str(e)}")
            return {"error": f"处理请求失败: {str(e)}"}
            
    def handle_method_call(self, method_name, params, client_address):
        """处理方法调用"""
        # 检查方法名
        if not method_name:
            return {"error": "未指定方法名"}
            
        # 转换参数类型
        try:
            params = convert_params(method_name, params)
        except ValueError as e:
            return {"error": f"参数错误: {str(e)}"}
            
        # 处理初始化方法
        if method_name == "init":
            if len(params) < 3:
                return {"error": "init方法需要3个参数: ip, port, timeout"}
                
            device_ip = params[0]
            # 创建新的MytClient实例
            with self.clients_lock:
                # 如果已存在相同IP的连接，先关闭它
                if device_ip in self.clients:
                    try:
                        self.clients[device_ip].close()
                    except:
                        pass
                        
                # 创建新连接
                client = MytClient()
                result = client.init(*params)
                
                # 检查初始化结果
                if isinstance(result, dict) and "error" in result:
                    return result
                    
                # 保存客户端实例
                self.clients[device_ip] = client
                return {"result": result}
                
        # 处理关闭特定设备连接的方法
        elif method_name == "close_device":
            if len(params) < 1:
                return {"error": "close_device方法需要1个参数: device_ip"}
                
            device_ip = params[0]
            with self.clients_lock:
                if device_ip not in self.clients:
                    return {"error": f"设备 {device_ip} 未连接或未初始化"}
                    
                try:
                    # 调用close方法进行资源释放
                    result = self.clients[device_ip].close()
                except Exception as e:
                    result = {"error": f"关闭设备连接失败: {str(e)}"}
                    
                # 移除客户端实例
                del self.clients[device_ip]
                # 手动触发垃圾回收
                gc.collect()
                return {"result": result}
                
        # 处理其他方法调用
        else:
            # 需要设备IP作为第一个参数
            if len(params) < 1:
                return {"error": f"{method_name}方法需要至少1个参数: device_ip"}
                
            device_ip = params[0]
            actual_params = params[1:]  # 移除设备IP参数
            
            with self.clients_lock:
                if device_ip not in self.clients:
                    return {"error": f"设备 {device_ip} 未连接或未初始化"}
                    
                client = self.clients[device_ip]
                
                # 检查方法是否存在
                if not hasattr(client, method_name):
                    return {"error": f"方法 {method_name} 不存在"}
                    
                # 调用方法
                try:
                    method = getattr(client, method_name)
                    result = method(*actual_params)
                    return {"result": result}
                except Exception as e:
                    print(f"调用方法 {method_name} 时出错: {str(e)}")
                    return {"error": f"方法调用失败: {str(e)}"}

def convert_params(method_name, params):
    """Convert parameters to their correct types based on the method name."""
    if not params:
        return params
        
    # Methods that need integer parameters
    int_params = {
        'init': [1, 2],  # port, timeout
        'setRpaWorkMode': [1],  # mode (after device_ip)
        'takeCaptrueCompress': [1, 2],  # quality, timeout (after device_ip)
        'screentshot': [1, 2],  # quality (after device_ip)
        'screentshotEx': [1, 2, 3, 4, 5, 6],  # x1, y1, x2, y2, quality (after device_ip)
        'ClearText': [1],  # count (after device_ip)
        'touchDown': [1, 2, 3],  # finger_id, x, y (after device_ip)
        'touchMove': [1, 2, 3],  # finger_id, x, y (after device_ip)
        'touchUp': [1, 2, 3],  # finger_id, x, y (after device_ip)
        'swipe': [1, 2, 3, 4, 5, 6],  # finger_id, x1, y1, x2, y2, duration (after device_ip)
        'keyPress': [1],  # keycode (after device_ip)
        'dumpNodeXml': [1],  # include_invisible (after device_ip)
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
        # 获取服务器端口参数
        port = 8899  # 默认端口
        if len(sys.argv) > 1:
            try:
                port = int(sys.argv[1])
            except ValueError:
                print("端口参数必须是整数")
                sys.exit(1)
                
        # 创建并启动服务器
        server = MytSocketServer(port=port)
        print(f"正在启动服务器，端口: {port}")
        server.start()
        
    except KeyboardInterrupt:
        print("服务器被用户中断")
    except Exception as e:
        print(f"服务器出现异常: {str(e)}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main() 