import platform
import psutil
import GPUtil
import json
import requests
import sys
import os

def get_size(bytes, suffix="B"):
    """
    Scale bytes to its proper format
    e.g:
        1253656 => '1.20MB'
        1253656678 => '1.17GB'
    """
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor

def get_system_info():
    print("Gathering system information...")
    
    # System Information
    uname = platform.uname()
    system_info = {
        "os": f"{uname.system} {uname.release}",
        "node_name": uname.node,
        "release": uname.release,
        "version": uname.version,
        "machine": uname.machine,
        "processor": uname.processor
    }

    # CPU Information
    cpufreq = psutil.cpu_freq()
    cpu_info = {
        "physical_cores": psutil.cpu_count(logical=False),
        "total_cores": psutil.cpu_count(logical=True),
        "max_frequency": f"{cpufreq.max:.2f}Mhz" if cpufreq else "N/A",
        "current_frequency": f"{cpufreq.current:.2f}Mhz" if cpufreq else "N/A",
        "cpu_usage": f"{psutil.cpu_percent()}%"
    }

    # Memory Information
    svmem = psutil.virtual_memory()
    memory_info = {
        "total": get_size(svmem.total),
        "available": get_size(svmem.available),
        "used": get_size(svmem.used),
        "percentage": f"{svmem.percent}%"
    }

    # GPU Information
    gpus = GPUtil.getGPUs()
    gpu_info = []
    for gpu in gpus:
        gpu_info.append({
            "id": gpu.id,
            "name": gpu.name,
            "load": f"{gpu.load*100}%",
            "free_memory": f"{gpu.memoryFree}MB",
            "used_memory": f"{gpu.memoryUsed}MB",
            "total_memory": f"{gpu.memoryTotal}MB",
            "temperature": f"{gpu.temperature} C"
        })

    # Disk Information
    partitions = psutil.disk_partitions()
    disk_info = []
    for partition in partitions:
        try:
            partition_usage = psutil.disk_usage(partition.mountpoint)
        except PermissionError:
            continue
        disk_info.append({
            "device": partition.device,
            "mountpoint": partition.mountpoint,
            "fstype": partition.fstype,
            "total_size": get_size(partition_usage.total),
            "used": get_size(partition_usage.used),
            "free": get_size(partition_usage.free),
            "percentage": f"{partition_usage.percent}%"
        })

    return {
        "system": system_info,
        "cpu": cpu_info,
        "memory": memory_info,
        "gpu": gpu_info,
        "disk": disk_info
    }

def main():
    print("Welcome to the Steam Game Compatibility Checker Helper!")
    print("This tool will scan your hardware specifications and send them to the server for analysis.")
    print("No personal data is collected, only hardware specs.")
    
    consent = input("Do you want to proceed? (y/n): ")
    if consent.lower() != 'y':
        print("Aborted.")
        return

    specs = get_system_info()
    print(json.dumps(specs, indent=4))
    
    send = input("Do you want to send this report to the server? (y/n): ")
    if send.lower() != 'y':
        print("Aborted.")
        return

    # TODO: Replace with actual backend URL
    backend_url = "https://steamscan.onrender.com/api/specs" 
    
    try:
        response = requests.post(backend_url, json=specs)
        if response.status_code == 200:
            print("Successfully sent system report!")
            res_json = response.json()
            print("Response:", res_json)
            
            report_id = res_json.get('reportId')
            if report_id:
                print(f"\nReport ID: {report_id}")
                print("Opening browser to save report...")
                import webbrowser
                # Open a special URL that saves the ID to localStorage
                webbrowser.open(f"https://steamscan.vercel.app/save-report/{report_id}")

        else:
            print(f"Failed to send report. Status code: {response.status_code}")
            print("Response:", response.text)
    except Exception as e:
        print(f"Error sending report: {e}")

    input("Press Enter to exit...")

if __name__ == "__main__":
    main()
