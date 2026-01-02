function clock --wraps='tty-clock -s -C 1 -c' --description 'alias clock=tty-clock -s -C 1 -c'
  tty-clock -s -C 1 -c $argv
        
end
