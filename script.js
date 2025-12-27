 // Create Floating Particles
        function createParticles() {
            const container = document.getElementById('particles');
            
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.width = `${Math.random() * 6 + 2}px`;
                particle.style.height = particle.style.width;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.background = Math.random() > 0.5 ? 'var(--cyber-blue)' : 'var(--neon-blue)';
                particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
                particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particle.style.setProperty('--tx', Math.random() * 2 - 1);
                particle.style.setProperty('--ty', Math.random() * 2 - 1);
                
                container.appendChild(particle);
            }
        }
        // Neural Network Interactive Functions
let networkActive = false;
let connections = [];

function createNetworkConnections() {
    const svg = document.querySelector('.connections-svg');
    const inputNeurons = document.querySelectorAll('.input-layer .neuron');
    const hidden1Neurons = document.querySelectorAll('.hidden-layer-1 .neuron');
    const hidden2Neurons = document.querySelectorAll('.hidden-layer-2 .neuron');
    const outputNeurons = document.querySelectorAll('.output-layer .neuron');
    
    // Clear existing connections
    svg.innerHTML = '';
    connections = [];
    
    // Create connections between input and hidden layer 1
    inputNeurons.forEach(inputNeuron => {
        hidden1Neurons.forEach(hiddenNeuron => {
            createConnection(inputNeuron, hiddenNeuron);
        });
    });
    
    // Create connections between hidden layer 1 and hidden layer 2
    hidden1Neurons.forEach(hidden1Neuron => {
        hidden2Neurons.forEach(hidden2Neuron => {
            createConnection(hidden1Neuron, hidden2Neuron);
        });
    });
    
    // Create connections between hidden layer 2 and output layer
    hidden2Neurons.forEach(hidden2Neuron => {
        outputNeurons.forEach(outputNeuron => {
            createConnection(hidden2Neuron, outputNeuron);
        });
    });
}

function createConnection(fromNeuron, toNeuron) {
    const svg = document.querySelector('.connections-svg');
    const fromRect = fromNeuron.getBoundingClientRect();
    const toRect = toNeuron.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    const x1 = fromRect.left + fromRect.width/2 - svgRect.left;
    const y1 = fromRect.top + fromRect.height/2 - svgRect.top;
    const x2 = toRect.left + toRect.width/2 - svgRect.left;
    const y2 = toRect.top + toRect.height/2 - svgRect.top;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'connection-path');
    path.setAttribute('d', `M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`);
    path.setAttribute('stroke-dasharray', '10,5');
    
    svg.appendChild(path);
    connections.push({path, fromNeuron, toNeuron});
}

function toggleNetworkPulse() {
    networkActive = !networkActive;
    const neurons = document.querySelectorAll('.neuron');
    const connectionPaths = document.querySelectorAll('.connection-path');
    
    if (networkActive) {
        neurons.forEach(neuron => {
            neuron.classList.add('active');
        });
        connectionPaths.forEach(path => {
            path.classList.add('active');
            path.style.animationDuration = `${Math.random() * 3 + 1}s`;
        });
        document.getElementById('activeNeurons').textContent = '12';
        document.getElementById('activeConnections').textContent = '45';
    } else {
        neurons.forEach(neuron => {
            neuron.classList.remove('active');
        });
        connectionPaths.forEach(path => {
            path.classList.remove('active');
        });
    }
}

function simulateDataFlow() {
    const inputNeurons = document.querySelectorAll('.input-layer .neuron');
    const outputNeurons = document.querySelectorAll('.output-layer .neuron');
    
    // Reset all neurons
    document.querySelectorAll('.neuron').forEach(n => n.classList.remove('data-flow'));
    
    // Animate data flow from input to output
    inputNeurons.forEach((neuron, index) => {
        setTimeout(() => {
            neuron.classList.add('data-flow');
            
            // Find connections from this neuron
            connections.forEach(conn => {
                if (conn.fromNeuron === neuron) {
                    conn.path.classList.add('data-flow-active');
                    setTimeout(() => {
                        conn.toNeuron.classList.add('data-flow');
                    }, 300);
                }
            });
        }, index * 200);
    });
    
    // Final output activation
    setTimeout(() => {
        outputNeurons.forEach((neuron, index) => {
            setTimeout(() => {
                neuron.classList.add('data-flow');
                neuron.style.transform = 'scale(1.3)';
                
                // Update threat level based on which output neuron is activated
                if (index === 2) { // High risk neuron
                    document.getElementById('currentThreat').textContent = 'High';
                    document.getElementById('currentThreat').className = 'info-value threat-high';
                }
            }, index * 300);
        });
    }, 1500);
}

function highlightThreatPath() {
    // Reset all connections
    connections.forEach(conn => {
        conn.path.classList.remove('threat-path');
        conn.path.style.stroke = 'rgba(0, 204, 255, 0.3)';
    });
    
    // Highlight a specific threat detection path
    const threatPaths = connections.filter((_, index) => index % 7 === 0);
    
    threatPaths.forEach((conn, i) => {
        setTimeout(() => {
            conn.path.classList.add('threat-path');
            conn.path.style.stroke = 'var(--danger-red)';
            conn.path.style.strokeWidth = '3';
            
            // Pulse the connected neurons
            conn.fromNeuron.classList.add('threat-pulse');
            conn.toNeuron.classList.add('threat-pulse');
            
            setTimeout(() => {
                conn.fromNeuron.classList.remove('threat-pulse');
                conn.toNeuron.classList.remove('threat-pulse');
            }, 1000);
        }, i * 200);
    });
    
    // Update threat level to high
    document.getElementById('currentThreat').textContent = 'High';
    document.getElementById('currentThreat').className = 'info-value threat-high';
    document.getElementById('networkAccuracy').textContent = '99.8%';
}

// Add hover effects for neurons
document.addEventListener('DOMContentLoaded', () => {
    createNetworkConnections();
    
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.addEventListener('mouseenter', function() {
            const feature = this.getAttribute('data-feature');
            const threat = this.getAttribute('data-threat');
            
            if (feature) {
                document.getElementById('featureTooltip').textContent = 
                    `Monitoring: ${feature}`;
            } else if (threat) {
                document.getElementById('featureTooltip').textContent = 
                    `Threat Level: ${threat}`;
            }
        });
        
        neuron.addEventListener('mouseleave', function() {
            document.getElementById('featureTooltip').textContent = 
                'Hover over neurons to see details';
        });
    });
    
    // Auto-activate network after 3 seconds
    setTimeout(() => {
        toggleNetworkPulse();
    }, 3000);
});
        
       // 1. تحسين الأداء بإضافة debounce للـ scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkScroll, 50);
});

// 2. تحسين دقة مؤشر التهديد
function updateThreatMeter(level) {
    const pointer = document.getElementById('threatPointer');
    if (!pointer) {
        // إنشاء المؤشر إذا لم يكن موجوداً
        const threatVisual = document.querySelector('.threat-visual');
        if (threatVisual) {
            const newPointer = document.createElement('div');
            newPointer.id = 'threatPointer';
            newPointer.style.cssText = 'position: absolute; top: 50%; left: 50%; width: 3px; height: 80px; background: white; transform-origin: bottom center; transform: translate(-50%, -100%) rotate(-45deg); transition: transform 0.5s; z-index: 1;';
            threatVisual.appendChild(newPointer);
        }
    }
}
        
        // Navigation Indicator
        const navLinks = document.querySelectorAll('nav a');
        const navIndicator = document.querySelector('.nav-indicator');
        
        function updateNavIndicator() {
            const activeLink = document.querySelector('nav a.active');
            if (activeLink) {
                const rect = activeLink.getBoundingClientRect();
                const navRect = activeLink.parentElement.parentElement.getBoundingClientRect();
                navIndicator.style.left = `${rect.left - navRect.left}px`;
                navIndicator.style.width = `${rect.width}px`;
            }
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    
                    // Update active class
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    updateNavIndicator();
                    
                    // Scroll to section
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Set initial nav indicator
        setTimeout(updateNavIndicator, 100);
        
        // Demo Functions
        function simulateNormalActivity() {
            const elements = ['profileLoad', 'keystrokeMonitor', 'mouseAnalysis', 'appTracking', 'anomalyDetection'];
            
            elements.forEach((id, index) => {
                const element = document.getElementById(id);
                element.innerHTML = '';
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        element.innerHTML += '█ ';
                    }, (index * 300) + (i * 100));
                }
            });
            
            setTimeout(() => {
                document.getElementById('demoThreatLevel').textContent = 'LOW';
                document.getElementById('demoThreatLevel').style.color = 'var(--matrix-green)';
                document.getElementById('systemStatus').textContent = 'SECURE';
                document.getElementById('systemStatus').style.color = 'var(--matrix-green)';
                updateThreatMeter('low');
            }, 2000);
        }
        
        function simulateSuspiciousActivity() {
            simulateNormalActivity();
            
            setTimeout(() => {
                document.getElementById('demoThreatLevel').textContent = 'MEDIUM';
                document.getElementById('demoThreatLevel').style.color = 'var(--warning-yellow)';
                document.getElementById('systemStatus').textContent = 'MONITORING';
                document.getElementById('systemStatus').style.color = 'var(--warning-yellow)';
                updateThreatMeter('medium');
                
                const demoContent = document.getElementById('demoContent');
                const warning = document.createElement('div');
                warning.innerHTML = '> WARNING: Unusual typing patterns detected';
                warning.style.color = 'var(--warning-yellow)';
                warning.style.marginTop = '15px';
                demoContent.appendChild(warning);
            }, 2500);
        }
        
        function simulateThreatActivity() {
            simulateNormalActivity();
            
            setTimeout(() => {
                document.getElementById('demoThreatLevel').textContent = 'HIGH';
                document.getElementById('demoThreatLevel').style.color = 'var(--danger-red)';
                document.getElementById('systemStatus').textContent = 'THREAT DETECTED';
                document.getElementById('systemStatus').style.color = 'var(--danger-red)';
                updateThreatMeter('high');
                
                const demoContent = document.getElementById('demoContent');
                const threat = document.createElement('div');
                threat.innerHTML = '> ALERT: Insider threat detected!';
                threat.style.color = 'var(--danger-red)';
                threat.style.marginTop = '15px';
                threat.style.fontWeight = 'bold';
                demoContent.appendChild(threat);
                
                setTimeout(() => {
                    const action = document.createElement('div');
                    action.innerHTML = '> ACTION: Session terminated, admin notified';
                    action.style.color = 'var(--danger-red)';
                    demoContent.appendChild(action);
                }, 1000);
            }, 2500);
        }
        
        function updateThreatMeter(level) {
            const pointer = document.getElementById('threatPointer');
            const threatLevel = document.getElementById('threatLevel');
            
            let angle, color, text;
            
            switch(level) {
                case 'low':
                    angle = -45;
                    color = 'var(--matrix-green)';
                    text = 'LOW';
                    break;
                case 'medium':
                    angle = 0;
                    color = 'var(--warning-yellow)';
                    text = 'MEDIUM';
                    break;
                case 'high':
                    angle = 45;
                    color = 'var(--danger-red)';
                    text = 'HIGH';
                    break;
            }
            
            pointer.style.transform = `rotate(${angle}deg) translateY(-50%)`;
            threatLevel.style.color = color;
            threatLevel.textContent = text;
        }
        
        // Scroll Animations
        const animateElements = document.querySelectorAll('.animate-float');
        
        function checkScroll() {
            animateElements.forEach((element, index) => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }
        
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('load', checkScroll);
        
        // Auto demo for presentation
        let demoCounter = 0;
        const demoInterval = setInterval(() => {
            demoCounter++;
            const scenarios = ['normal', 'suspicious', 'threat'];
            const nextScenario = scenarios[demoCounter % 3];
            
            if (nextScenario === 'normal') simulateNormalActivity();
            else if (nextScenario === 'suspicious') simulateSuspiciousActivity();
            else simulateThreatActivity();
        }, 8000);
        
        // Initialize everything
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            createNeuralNetwork();
            simulateNormalActivity();
            checkScroll();
            
            // Interactive threat points
            document.querySelectorAll('.threat-point').forEach(point => {
                point.addEventListener('mouseenter', function() {
                    this.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    this.style.boxShadow = '0 0 30px var(--danger-red)';
                });
                
                point.addEventListener('mouseleave', function() {
                    this.style.transform = 'translate(-50%, -50%) scale(1)';
                    this.style.boxShadow = '0 0 20px var(--danger-red)';
                });
            });
            
            // Interactive feature items
            document.querySelectorAll('.feature-item').forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(10px)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
            });
        });
        const style = document.createElement('style');
style.textContent = `
    .neuron.data-flow, .threat-pulse {
        animation: neuronPulse 1s infinite !important;
    }
    
    .connection-path.data-flow-active {
        animation: dataFlow 1s linear infinite !important;
    }
    
    .connection-path.threat-path {
        stroke: var(--danger-red) !important;
        stroke-width: 2px !important;
        filter: drop-shadow(0 0 5px var(--danger-red)) !important;
    }
`;
document.head.appendChild(style);